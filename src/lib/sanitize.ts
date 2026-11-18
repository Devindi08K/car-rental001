export function sanitizeText(value: string) {
  return value
    .replace(/\u0000/g, "")
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

export function sanitizeMultiline(value: string) {
  return sanitizeText(value).replace(/[ \t]+\n/g, "\n");
}
