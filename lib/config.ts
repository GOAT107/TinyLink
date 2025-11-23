export const APP_VERSION = '1.0';

export function getBaseUrl(): string {
  const envBase = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (envBase) return envBase;

  // Local dev fallback; fine for non-production.
  return 'http://localhost:3000';
}