/**
 * Remove todas as tags HTML, null bytes e normaliza whitespace.
 * Usado em todos os campos de texto livre antes de persistir no banco.
 *
 * Exemplos:
 *   '<script>alert(1)</script>texto' → 'texto'
 *   '<img src=x onerror=alert(1)>'  → ''
 *   'texto normal'                  → 'texto normal'
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // remove tags HTML
    .replace(/\0/g, '')      // remove null bytes
    .trim();
}

/**
 * Aceita apenas URLs http/https. Retorna null para qualquer outro valor,
 * bloqueando vetores como javascript:alert(1) em campos de URL.
 */
export function sanitizeUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : null;
}
