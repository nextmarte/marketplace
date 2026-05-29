import { cookies } from "next/headers";
import { SESSION_COOKIE, isAuthenticated } from "./auth";

/** Verdadeiro se a requisição atual tem um cookie de sessão de admin válido. */
export async function isAdminRequest(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return isAuthenticated(token);
}
