/**
 * Monta a URL pública (R2) de uma imagem a partir da sua key.
 * Retorna null quando não há key ou a base pública não está configurada
 * (a UI mostra um placeholder nesse caso).
 */
export function publicImageUrl(key: string | null | undefined): string | null {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!key || !base) return null;
  return `${base.replace(/\/+$/, "")}/${key.replace(/^\/+/, "")}`;
}
