// Renders a JSON-LD <script> tag with the given structured-data object.
// All callers serialise their own object via this single component so the
// raw-HTML React API is centralised in one well-reviewed place. The `data`
// argument MUST always be a server-trusted, JSON-serialisable value built
// from static configuration or schema helpers — never user input.
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- intentional, see file header
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
