const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export function isValidCode(code: string): boolean {
  if (!code) return false;
  return CODE_REGEX.test(code.trim());
}

export function isValidUrl(url: string): boolean {
  if (!url) return false;

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  return url.trim();
}

export type ValidationError = {
  field: 'url' | 'code' | 'generic';
  message: string;
};