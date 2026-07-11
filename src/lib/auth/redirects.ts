export function safeNextPath(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return value.startsWith("/") && !value.startsWith("//") ? value : "";
}

export function withAuthMessage(path: string, message: string, next = "") {
  const params = new URLSearchParams({ error: message });
  const safeNext = safeNextPath(next);

  if (safeNext) {
    params.set("next", safeNext);
  }

  return `${path}?${params.toString()}`;
}
