import { NextResponse, type NextRequest } from "next/server";

export const config = { matcher: ["/admin", "/admin/:path*"] };

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER ?? "admin";
  const pass = process.env.ADMIN_PASSWORD ?? "";
  const header = req.headers.get("authorization");

  if (pass.length > 0 && header?.startsWith("Basic ")) {
    const decoded = atob(header.slice(6));
    const sep = decoded.indexOf(":");
    const u = decoded.slice(0, sep);
    const p = decoded.slice(sep + 1);
    if (u === user && p === pass) {
      return NextResponse.next();
    }
  }

  // Em prefetch/RSC-prefetch não enviamos WWW-Authenticate, para o navegador
  // não abrir o popup de login sozinho ao pré-carregar o link do /admin.
  const isPrefetch =
    req.headers.get("next-router-prefetch") === "1" ||
    req.headers.get("purpose") === "prefetch";

  return new NextResponse("Autenticação necessária.", {
    status: 401,
    headers: isPrefetch
      ? {}
      : { "WWW-Authenticate": 'Basic realm="Amperia Admin"' },
  });
}
