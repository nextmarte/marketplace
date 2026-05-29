import Link from "next/link";
import { deletePart } from "@/app/_actions/parts";
import { StockBadge } from "@/components/stock-badge";
import { formatPriceBRL } from "@/lib/format";
import { listParts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminPartsPage() {
  const parts = await listParts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-ink">
          Peças ({parts.length})
        </h1>
        <Link
          href="/admin/pecas/nova"
          className="rounded-full bg-brand-500 px-5 py-2.5 font-semibold text-ink transition-colors hover:bg-brand-400"
        >
          + Nova peça
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-muted-fg">
              <th className="p-4 font-medium">Peça</th>
              <th className="p-4 font-medium">Categoria</th>
              <th className="p-4 font-medium">Preço</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="p-4">
                  <p className="font-medium text-ink">{p.name}</p>
                  <p className="font-mono text-xs text-muted-fg">{p.sku}</p>
                </td>
                <td className="p-4 text-muted-fg">{p.category.name}</td>
                <td className="p-4 font-medium text-ink">
                  {formatPriceBRL(p.priceCents)}
                </td>
                <td className="p-4">
                  <StockBadge status={p.stockStatus} />
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/pecas/${p.id}/editar`}
                      className="font-medium text-brand-700 hover:text-brand-600"
                    >
                      Editar
                    </Link>
                    <form action={deletePart}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="font-medium text-muted-fg transition-colors hover:text-scarce"
                      >
                        Excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        href="/admin"
        className="mt-6 inline-block text-sm text-muted-fg transition-colors hover:text-ink"
      >
        ← Voltar ao painel
      </Link>
    </div>
  );
}
