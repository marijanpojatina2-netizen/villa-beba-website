'use server';

import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { CONTACT } from '@/lib/contact';
import { isValidTokenFormat } from '@/lib/checkin/token';
import { verifyMrz } from '@/lib/checkin/mrz';
import { validateGuest, type GuestInput } from '@/lib/checkin/validate';
import {
  getLinkByToken,
  tryConsumeScan,
  claimSubmission,
  insertGuests,
  revertSubmission,
} from '@/lib/checkin/db';

// Opus for accuracy on MRZ/ID reading; cost per scan is <1 cent at ~1600px.
const SCAN_MODEL = 'claude-opus-4-8';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

// Nullable enum fields must use anyOf — `enum` containing null alongside a
// union type is rejected by the structured-outputs schema validator.
const nullableEnum = (values: string[], description?: string) => ({
  anyOf: [{ type: 'string', enum: values }, { type: 'null' }],
  ...(description ? { description } : {}),
});

const SCAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'firstName', 'lastName', 'gender', 'citizenship', 'birthDate', 'birthCountry',
    'birthPlace', 'documentType', 'documentNumber', 'mrzLines', 'lowConfidenceFields',
  ],
  properties: {
    firstName: { type: ['string', 'null'] },
    lastName: { type: ['string', 'null'] },
    gender: nullableEnum(['M', 'F']),
    citizenship: {
      type: ['string', 'null'],
      description: 'ISO 3166-1 alpha-2 country code of citizenship/nationality',
    },
    birthDate: { type: ['string', 'null'], description: 'YYYY-MM-DD' },
    birthCountry: {
      type: ['string', 'null'],
      description:
        'ISO 3166-1 alpha-2 country of birth, when determinable from the place-of-birth field',
    },
    birthPlace: { type: ['string', 'null'] },
    documentType: nullableEnum(['id_card', 'passport', 'other']),
    documentNumber: { type: ['string', 'null'] },
    mrzLines: {
      type: 'array',
      items: { type: 'string' },
      description: 'Machine-readable zone lines exactly as printed, or empty array',
    },
    lowConfidenceFields: {
      type: 'array',
      items: { type: 'string' },
      description: 'Names of fields you are not confident about',
    },
  },
} as const;

const SCAN_PROMPT =
  'Read this identity document (ID card or passport). Extract the holder’s data ' +
  'into the JSON schema. Use the MRZ lines when present — transcribe them character-' +
  'for-character including "<" fillers. Dates as YYYY-MM-DD. citizenship and ' +
  'birthCountry as ISO 3166-1 alpha-2 (e.g. DE, HR, AT); infer birthCountry from ' +
  'the place-of-birth field when it names a country or a well-known city. If a ' +
  'field is unreadable or absent, use null and list it in lowConfidenceFields. ' +
  'Do not guess document numbers.';

export interface ScanResult {
  success: boolean;
  error?: 'invalid_request' | 'scan_limit' | 'unreadable' | 'scan_failed';
  fields?: Partial<GuestInput>;
  // Fields the guest should double-check (AI unsure or MRZ checksum mismatch).
  reviewFields?: string[];
  mrzVerified?: boolean;
}

export async function scanDocument(formData: FormData): Promise<ScanResult> {
  const token = String(formData.get('token') ?? '');
  const file = formData.get('image');
  if (!isValidTokenFormat(token) || !(file instanceof File)) {
    return { success: false, error: 'invalid_request' };
  }
  if (
    file.size === 0 ||
    file.size > MAX_IMAGE_BYTES ||
    !IMAGE_TYPES.includes(file.type as (typeof IMAGE_TYPES)[number])
  ) {
    return { success: false, error: 'invalid_request' };
  }
  if (!(await tryConsumeScan(token))) {
    return { success: false, error: 'scan_limit' };
  }

  // Image is held in memory only for the duration of this call — never persisted.
  const data = Buffer.from(await file.arrayBuffer()).toString('base64');

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: SCAN_MODEL,
      max_tokens: 2000,
      output_config: { format: { type: 'json_schema', schema: SCAN_SCHEMA } },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
                data,
              },
            },
            { type: 'text', text: SCAN_PROMPT },
          ],
        },
      ],
    });

    if (response.stop_reason === 'refusal' || response.content.length === 0) {
      return { success: false, error: 'unreadable' };
    }
    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return { success: false, error: 'scan_failed' };
    }
    const raw = JSON.parse(textBlock.text) as {
      firstName: string | null;
      lastName: string | null;
      gender: 'M' | 'F' | null;
      citizenship: string | null;
      birthDate: string | null;
      birthCountry: string | null;
      birthPlace: string | null;
      documentType: GuestInput['documentType'] | null;
      documentNumber: string | null;
      mrzLines: string[];
      lowConfidenceFields: string[];
    };

    const review = new Set(raw.lowConfidenceFields);
    let mrzVerified = false;
    const mrz = verifyMrz(raw.mrzLines ?? []);
    if (mrz.recognized) {
      // Checksum-verified MRZ values override the visually-read ones.
      if (mrz.documentNumberValid && mrz.documentNumber) {
        raw.documentNumber = mrz.documentNumber;
        review.delete('documentNumber');
      } else if (mrz.documentNumberValid === false) {
        review.add('documentNumber');
      }
      if (mrz.birthDateValid && mrz.birthDateIso) {
        raw.birthDate = mrz.birthDateIso;
        review.delete('birthDate');
      } else if (mrz.birthDateValid === false) {
        review.add('birthDate');
      }
      mrzVerified = mrz.documentNumberValid === true && mrz.birthDateValid === true;
    }

    const fields: Partial<GuestInput> = {};
    if (raw.firstName) fields.firstName = raw.firstName;
    if (raw.lastName) fields.lastName = raw.lastName;
    if (raw.gender) fields.gender = raw.gender;
    if (raw.citizenship) {
      fields.citizenship = raw.citizenship.toUpperCase();
      // Sensible default: residence country usually matches citizenship.
      fields.residenceCountry = raw.citizenship.toUpperCase();
    }
    if (raw.birthDate) fields.birthDate = raw.birthDate;
    if (raw.birthCountry) fields.birthCountry = raw.birthCountry.toUpperCase();
    if (raw.birthPlace) fields.birthPlace = raw.birthPlace;
    if (raw.documentType) fields.documentType = raw.documentType;
    if (raw.documentNumber) fields.documentNumber = raw.documentNumber.toUpperCase();

    if (Object.keys(fields).length === 0) {
      console.warn(
        '[checkin] scan unreadable: model returned no usable fields',
        JSON.stringify({ lowConfidence: raw.lowConfidenceFields, mrzLines: raw.mrzLines?.length ?? 0 }),
      );
      return { success: false, error: 'unreadable' };
    }
    console.log(
      `[checkin] scan ok: ${Object.keys(fields).length} fields, mrzVerified=${mrzVerified}, review=[${[...review].join(',')}]`,
    );
    return { success: true, fields, reviewFields: [...review], mrzVerified };
  } catch (err) {
    console.error('[checkin] scan error:', err instanceof Error ? err.message : String(err));
    return { success: false, error: 'scan_failed' };
  }
}

export interface SubmitResult {
  success: boolean;
  error?: 'invalid_request' | 'already_submitted' | 'validation' | 'server';
  invalidGuests?: Array<{ index: number; fields: string[] }>;
}

export async function submitCheckin(
  token: string,
  guests: GuestInput[],
): Promise<SubmitResult> {
  if (
    !isValidTokenFormat(token) ||
    !Array.isArray(guests) ||
    guests.length === 0 ||
    guests.length > 20
  ) {
    return { success: false, error: 'invalid_request' };
  }
  const link = await getLinkByToken(token);
  if (!link) return { success: false, error: 'invalid_request' };
  if (link.status !== 'pending') return { success: false, error: 'already_submitted' };

  const invalid = guests
    .map((g, index) => ({ index, fields: validateGuest(g) }))
    .filter((r) => r.fields.length > 0);
  if (invalid.length) {
    return { success: false, error: 'validation', invalidGuests: invalid };
  }

  const linkId = await claimSubmission(token);
  if (linkId === null) return { success: false, error: 'already_submitted' };

  try {
    await insertGuests(linkId, guests);
  } catch (err) {
    console.error('[checkin] insert error:', err instanceof Error ? err.message : String(err));
    await revertSubmission(linkId).catch(() => {});
    return { success: false, error: 'server' };
  }

  // Email is a notification only — submission already saved. No document
  // numbers in the email; details live in /admin.
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const names = guests.map((g) => `${g.firstName} ${g.lastName}`).join(', ');
      await resend.emails.send({
        from: 'Villa Ballena & Beluga <onboarding@resend.dev>',
        to: [process.env.OWNER_EMAIL || CONTACT.email],
        subject: `Guest check-in received — ${link.villa} — ${link.arrival_date}`,
        html:
          `<p>${guests.length} guest(s) submitted check-in data for ` +
          `<strong>${link.villa}</strong>, ${link.arrival_date} → ${link.departure_date}.</p>` +
          `<p>${names}</p>` +
          `<p><a href="https://www.ballenaandbeluga.com/admin">Open admin</a> to review and push to eVisitor.</p>`,
      });
    }
  } catch (err) {
    console.error('[checkin] notify error:', err instanceof Error ? err.message : String(err));
  }

  return { success: true };
}
