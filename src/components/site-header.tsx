import Link from "next/link";
import { CartCount } from "./cart-count";

const nav = [
  { href: "/pecas", label: "Catálogo" },
  { href: "/pecas?status=em_falta", label: "Em falta" },
  { href: "/#marcas", label: "Marcas" },
  { href: "/#como-funciona", label: "Como funciona" },
];

function BoltMark() {
  return (
    <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-brand-500 shadow-[0_0_18px_-2px_rgba(3,196,137,0.7)]">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink" fill="currentColor">
        <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" />
      </svg>
    </span>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 4h2l2.4 12.3a1 1 0 0 0 1 .7h8.7a1 1 0 0 0 1-.8L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.4" fill="currentColor" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line-dark bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <BoltMark />
          <span className="font-display text-xl font-extrabold tracking-tight text-paper">
            Amperia
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-paper/70 transition-colors hover:text-brand-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden text-sm font-medium text-paper/55 transition-colors hover:text-paper sm:block"
          >
            Admin
          </Link>
          <Link
            href="/carrinho"
            className="relative inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-400"
          >
            <CartIcon />
            <span className="hidden sm:inline">Carrinho</span>
            <CartCount />
          </Link>
        </div>
      </div>
      <div className="h-px w-full animate-pulse-line bg-gradient-to-r from-transparent via-brand-400 to-transparent" />
    </header>
  );
}
