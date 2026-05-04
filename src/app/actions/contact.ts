'use server';

import { Resend } from 'resend';
import { CONTACT } from '@/lib/contact';

interface InquiryData {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  villa: string;
  guests: string;
  message: string;
  howFound: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailHtml(d: InquiryData): string {
  const villaLabel =
    d.villa === 'ballena' ? 'Villa Ballena' :
    d.villa === 'beluga' ? 'Villa Beluga' :
    d.villa === 'both' ? 'Both villas (Complex BeBa)' :
    'Not specified';
  const dates =
    d.checkIn || d.checkOut
      ? `${escapeHtml(d.checkIn) || '—'} → ${escapeHtml(d.checkOut) || '—'}`
      : 'Not specified';
  const rows: Array<[string, string]> = [
    ['Villa', villaLabel],
    ['Dates', dates],
    ['Guests', escapeHtml(d.guests) || '—'],
    ['Name', escapeHtml(d.name)],
    ['Email', `<a href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a>`],
    ['Phone', escapeHtml(d.phone) || '—'],
    ['Source', escapeHtml(d.howFound) || '—'],
  ];
  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;font-weight:500;vertical-align:top;width:120px">${k}</td><td style="padding:8px 0;color:#1B2A4A;font-size:14px">${v}</td></tr>`,
    )
    .join('');
  const messageBlock = d.message
    ? `<div style="margin-top:24px;padding:16px;background:#F5F0E8;border-left:3px solid #1B2A4A;font-size:14px;color:#1B2A4A;white-space:pre-wrap">${escapeHtml(d.message)}</div>`
    : '';
  return `<!doctype html><html><body style="margin:0;padding:32px;background:#fafaf7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"><div style="max-width:600px;margin:0 auto;background:#fff;padding:32px;border:1px solid #e5e0d6"><h1 style="margin:0 0 8px;font-size:18px;color:#1B2A4A;letter-spacing:0.05em">New booking inquiry</h1><p style="margin:0 0 24px;color:#666;font-size:13px">Villa Ballena &amp; Beluga · ballenaandbeluga.com</p><table style="width:100%;border-collapse:collapse">${tableRows}</table>${messageBlock}<p style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e0d6;color:#999;font-size:12px">Reply directly to this email to respond to ${escapeHtml(d.name)}.</p></div></body></html>`;
}

export async function submitContactForm(formData: FormData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY not configured — inquiry not sent');
    return { success: false, error: 'email_service_unavailable' as const };
  }

  const data: InquiryData = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    checkIn: String(formData.get('checkIn') || '').trim(),
    checkOut: String(formData.get('checkOut') || '').trim(),
    villa: String(formData.get('villa') || '').trim(),
    guests: String(formData.get('guests') || '').trim(),
    message: String(formData.get('message') || '').trim(),
    howFound: String(formData.get('howFound') || '').trim(),
  };

  if (!data.name || !data.email) {
    return { success: false, error: 'invalid_input' as const };
  }

  const villaLabel =
    data.villa === 'ballena' ? 'Villa Ballena' :
    data.villa === 'beluga' ? 'Villa Beluga' :
    data.villa === 'both' ? 'Complex BeBa' :
    'unspecified';

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      // Until the sender domain is verified at Resend, we must use the
      // shared `onboarding@resend.dev` from-address — the email still
      // lands in the owner's inbox via CF Email Routing forwarding.
      // After domain verification add a CNAME at resend._domainkey and
      // flip this to `Villa Ballena & Beluga <info@ballenaandbeluga.com>`.
      from: 'Villa Ballena & Beluga <onboarding@resend.dev>',
      to: [CONTACT.email],
      replyTo: data.email,
      subject: `New booking inquiry — ${villaLabel} — ${data.name}`,
      html: buildEmailHtml(data),
    });

    if (error) {
      console.error('[contact] resend send error:', error);
      return { success: false, error: 'send_failed' as const };
    }

    return { success: true };
  } catch (err) {
    console.error('[contact] unexpected error:', err);
    return { success: false, error: 'send_failed' as const };
  }
}
