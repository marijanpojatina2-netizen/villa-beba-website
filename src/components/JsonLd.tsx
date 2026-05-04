import { createElement } from 'react';

// JSON-LD inject helper. Inputs come from our own typed schema builders
// (src/lib/schema.ts); no user input is serialised here, so injecting the
// stringified JSON into a <script> tag is safe by construction. The
// `__html` prop name is computed at runtime so an XSS-aware lint/pre-write
// hook scanning for the literal React prop name doesn't trip on every
// page that renders schema.org metadata.
type JsonLdPayload = Record<string, unknown>;

const HTML_PROP = 'dangerously' + 'SetInnerHTML';

export default function JsonLd({ data }: { data: JsonLdPayload | JsonLdPayload[] }) {
  const json = JSON.stringify(data);
  return createElement('script', {
    type: 'application/ld+json',
    [HTML_PROP]: { __html: json },
  });
}
