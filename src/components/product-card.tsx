import Link from "next/link";
import { formatPriceBRL } from "@/lib/format";
import type { PartWithRelations } from "@/lib/queries";
import { PartImage } from "./part-image";
import { StockBadge } from "./stock-badge";

export function ProductCard({ part }: { part: PartWithRelations }) {
  const brandNames = part.partBrands.map((pb) => pb.brand.name);

  return (
    <Link
      href={`/pecas/${part.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-200 hover:-translate-y-1 hover:border-brand-400 hover:shadow-[0_18px_50px_-18px_rgba(3,196,137,0.45)]"
    >
      <PartImage
        imageKey={part.imageKey}
        alt={part.name}
        className="aspect-[4/3] w-full"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-fg">
            {part.category.name}
          </span>
          <StockBadge status={part.stockStatus} />
        </div>

        <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-ink">
          {part.name}
        </h3>

        {brandNames.length > 0 && (
          <p className="line-clamp-1 text-xs text-muted-fg">
            {brandNames.join(" · ")}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="font-display text-lg font-bold text-ink">
            {formatPriceBRL(part.priceCents)}
          </span>
          <span className="font-mono text-[10px] text-muted-fg">{part.sku}</span>
        </div>
      </div>
    </Link>
  );
}
