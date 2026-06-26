export function normalizeInternalPath(
  path: string | null | undefined,
  fallback = "/dashboard",
) {
  if (!path) {
    return fallback;
  }

  const trimmed = path.trim();

  if (
    trimmed.length === 0 ||
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    /[\r\n]/.test(trimmed)
  ) {
    return fallback;
  }

  return trimmed;
}
