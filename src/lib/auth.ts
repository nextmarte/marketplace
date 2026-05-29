const enc = new TextEncoder();

export const SESSION_COOKIE = "amperia_session";

/** Comparação de tempo constante (funciona em edge e node). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Token de sessão derivado das credenciais — não forjável sem a senha. */
export async function sessionToken(): Promise<string> {
  const user = process.env.ADMIN_USER ?? "admin";
  const pass = process.env.ADMIN_PASSWORD ?? "";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    enc.encode(`amperia:${user}:${pass}`),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Valida o token do cookie de sessão. */
export async function isAuthenticated(
  token: string | undefined | null,
): Promise<boolean> {
  const pass = process.env.ADMIN_PASSWORD ?? "";
  if (pass.length === 0 || !token) return false;
  return safeEqual(token, await sessionToken());
}

/** Valida usuário/senha do formulário de login. */
export function verifyCredentials(user: string, pass: string): boolean {
  const U = process.env.ADMIN_USER ?? "admin";
  const P = process.env.ADMIN_PASSWORD ?? "";
  return P.length > 0 && safeEqual(user, U) && safeEqual(pass, P);
}
