const CODE_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

/**
 * Generate a random short code.
 * Length should be between 6–8 to respect the spec; default is 6.
 */
export function generateRandomCode(length = 6): string {
  if (length < 6 || length > 8) {
    // Clamp to valid range
    length = Math.min(8, Math.max(6, length));
  }

  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return result;
}