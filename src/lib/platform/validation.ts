export class FormValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormValidationError";
  }
}

export function textField(formData: FormData, name: string, options: { required?: boolean; max?: number } = {}) {
  const value = String(formData.get(name) ?? "").replace(/\r\n/g, "\n").trim();
  if (options.required && !value) throw new FormValidationError(`${name.replaceAll("_", " ")} is required.`);
  if (value.length > (options.max ?? 4000)) throw new FormValidationError(`${name.replaceAll("_", " ")} is too long.`);
  return value;
}

export function optionalUrl(formData: FormData, name: string) {
  const value = textField(formData, name, { max: 500 });
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error("unsupported protocol");
    return url.toString();
  } catch {
    throw new FormValidationError(`${name.replaceAll("_", " ")} must be a valid web address.`);
  }
}

export function uuidField(formData: FormData, name: string) {
  const value = textField(formData, name, { required: true, max: 36 });
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new FormValidationError(`Invalid ${name.replaceAll("_", " ")}.`);
  }
  return value;
}

export function scoreField(formData: FormData, name: string) {
  const value = Number(formData.get(name));
  if (!Number.isInteger(value) || value < 0 || value > 4) throw new FormValidationError("Rubric scores must be between 0 and 4.");
  return value;
}

export function safeFileName(name: string) {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned.slice(-120) || "evidence-file";
}
