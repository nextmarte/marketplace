import Link from "next/link";

const cols = [
  {
    title: "Catálogo",
    links: [
      { href: "/pecas", label: "Todas as peças" },
      { href: "/pecas?status=em_falta", label: "Em falta" },
      { href: "/pecas?category=recarga", label: "Recarga" },
      { href: "/pecas?category=freios", label: "Freios" },
    ],
  },
  {
    title: "Marcas",
    links: [
      { href: "/pecas?brand=byd", label: "BYD" },
      { href: "/pecas?brand=gwm", label: "GWM" },
      { href: "/pecas?brand=volvo", label: "Volvo" },
      { href: "/pecas?brand=tesla", label: "Tesla" },
    ],
  },
  {
    title: "Amperia",
    links: [
      { href: "/#como-funciona", label: "Como funciona" },
      { href: "/admin", label: "Área do vendedor" },
      { href: "/carrinho", label: "Carrinho" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line-dark bg-ink text-paper">
      <div className="absolute inset-0 amp-grid opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink" fill="currentColor">
                <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" />
              </svg>
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Amperia
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
            Marketplace de peças de reposição para carros elétricos no Brasil —
            foco nos itens em falta nas concessionárias.
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-brand-300">
            POC · imagens ilustrativas
          </p>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-paper/50">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-paper/75 transition-colors hover:text-brand-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-line-dark">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-paper/45 sm:px-6">
          © {new Date().getFullYear()} Amperia · Projeto de demonstração.
        </div>
      </div>
    </footer>
  );
}
