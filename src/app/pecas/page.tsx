import { CatalogFilters } from "@/components/catalog-filters";
import { ProductCard } from "@/components/product-card";
import type { StockStatus } from "@/lib/format";
import {
  listBrands,
  listCategories,
  listParts,
  type PartFilters,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

const STATUSES: StockStatus[] = ["em_falta", "sob_encomenda", "disponivel"];

function str(v: string | string[] | undefined): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const statusRaw = str(sp.status);

  const filters: PartFilters = {
    q: str(sp.q),
    brand: str(sp.brand),
    category: str(sp.category),
    status:
      statusRaw && STATUSES.includes(statusRaw as StockStatus)
        ? (statusRaw as StockStatus)
        : undefined,
  };

  const [parts, brands, categories] = await Promise.all([
    listParts(filters),
    listBrands(),
    listCategories(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 amp-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-300">
            Catálogo
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">
            Peças de carros elétricos
          </h1>
          <p className="mt-2 text-paper/60">
            {parts.length}{" "}
            {parts.length === 1 ? "peça encontrada" : "peças encontradas"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <CatalogFilters
          brands={brands}
          categories={categories}
          current={{
            q: filters.q,
            brand: filters.brand,
            category: filters.category,
            status: filters.status,
          }}
        />

        {parts.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-line bg-card/60 py-20 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              Nenhuma peça encontrada
            </p>
            <p className="mt-2 text-muted-fg">
              Tente remover alguns filtros ou buscar por outro termo.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {parts.map((part) => (
              <ProductCard key={part.id} part={part} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
