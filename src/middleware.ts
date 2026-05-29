import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isAuthenticated } from "@/lib/auth";

export const config = { matcher: ["/admin", "/admin/:path*"] };

export async function middleware(req: NextRequest) {
  // A própria página de login é pública.
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await isAuthenticated(token)) {
    return NextResponse.next();
  }

  // Sem sessão válida → redireciona para a página de login (sem popup).
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}
