/**
 * Tiny DOM helpers for the client labs. All interpolated strings come from
 * the i18n dictionaries or pre-written synthetic data; any user-entered
 * free text must pass through escapeHtml before interpolation.
 */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

/** Tagged template for building HTML strings. */
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  let out = '';
  strings.forEach((part, i) => {
    out += part;
    if (i < values.length) out += String(values[i] ?? '');
  });
  return out;
}
