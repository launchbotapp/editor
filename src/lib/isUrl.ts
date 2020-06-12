export default function isUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch (err) {
    return false;
  }
}

export function toFormattedUrl(href: string): string {
  let formatted = href;
  if (!isUrl(formatted) && !formatted.startsWith("/")) {
    formatted = `http://${formatted}`;
  }

  return formatted;
}