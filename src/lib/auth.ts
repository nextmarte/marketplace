import { timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Verifica as credenciais Basic Auth do admin no header da requisição. */
export async function isAdminRequest(): Promise<boolean> {
  const user = process.env.ADMIN_USER ?? "admin";
  const pass = process.env.ADMIN_PASSWORD ?? "";
  if (pass.length === 0) return false;

  const header = (await headers()).get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  let decoded = "";
  try {
    decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  } catch {
    return false;
  }
  const sep = decoded.indexOf(":");
  if (sep < 0) return false;

  const u = decoded.slice(0, sep);
  const p = decoded.slice(sep + 1);
  return safeEqual(u, user) && safeEqual(p, pass);
}

/** Garante que a requisição é de um admin autenticado (defesa em profundidade). */
export async function assertAdmin(): Promise<void> {
  if (!(await isAdminRequest())) {
    throw new Error("Não autorizado.");
  }
}
