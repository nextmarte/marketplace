import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { PartImage } from "@/components/part-image";
import { QuoteForm } from "@/components/quote-form";
import { StockBadge } from "@/components/stock-badge";
import { formatPriceBRL, stockStatusLabel } from "@/lib/format";
import { getPartBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

function Spec({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-fg">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm font-medium text-ink ${mono ? "font-mono" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const part = await getPartBySlug(slug);
  if (!part) notFound();

  const compat = part.partBrands.map((pb) => ({
    name: pb.brand.name,
    model: pb.model,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-fg">
        <Link href="/pecas" className="transition-colors hover:text-ink">
          Catálogo
        </Link>
        <span>/</span>
        <Link
          href={`/pecas?category=${part.category.slug}`}
          className="transition-colors hover:text-ink"
        >
          {part.category.name}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <PartImage
          imageKey={part.imageKey}
          alt={part.name}
          className="aspect-[4/3] w-full rounded-3xl"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-fg">
              {part.category.name}
            </span>
            <StockBadge status={part.stockStatus} />
          </div>

          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            {part.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-fg">
            {part.description}
          </p>

          <div className="mt-6 font-display text-4xl font-bold text-ink">
            {formatPriceBRL(part.priceCents)}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton
              item={{
                partId: part.id,
                slug: part.slug,
                name: part.name,
                priceCents: part.priceCents,
                imageKey: part.imageKey,
                sku: part.sku,
              }}
            />
            <a
              href="#cotacao"
              className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 font-semibold text-ink transition-colors hover:border-brand-400 hover:text-brand-700"
            >
              Solicitar cotação
            </a>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-line bg-card p-5">
            <Spec label="SKU" value={part.sku} mono />
            <Spec label="Vendedor" value={part.seller.name} />
            <Spec label="Disponibilidade" value={stockStatusLabel(part.stockStatus)} />
            <Spec label="Categoria" value={part.category.name} />
          </dl>

          {compat.length > 0 && (
            <div className="mt-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-muted-fg">
                Compatibilidade
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {compat.map((b) => (
                  <li
                    key={b.name}
                    className="rounded-full border border-line bg-card px-3 py-1.5 text-sm"
                  >
                    <span className="font-semibold text-ink">{b.name}</span>
                    {b.model && (
                      <span className="text-muted-fg"> · {b.model}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <section
        id="cotacao"
        className="mt-16 scroll-mt-24 rounded-3xl border border-line bg-card p-6 sm:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              Solicitar cotação
            </h2>
            <p className="mt-3 text-muted-fg">
              Precisa de quantidade, prazo ou um preço melhor? Envie seus dados e
              o fornecedor entra em contato sobre{" "}
              <strong className="text-ink">{part.name}</strong>.
            </p>
          </div>
          <QuoteForm partId={part.id} partName={part.name} />
        </div>
      </section>
    </div>
  );
}
