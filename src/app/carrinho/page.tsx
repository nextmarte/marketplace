"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { PartImage } from "@/components/part-image";
import { formatPriceBRL } from "@/lib/format";

export default function CartPage() {
  const { items, totalCents, count, setQty, remove } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Seu carrinho</h1>

      {count === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-card py-20 text-center">
          <p className="font-display text-xl font-semibold text-ink">
            Seu carrinho está vazio
          </p>
          <p className="mt-2 text-muted-fg">
            Explore o catálogo e adicione peças do seu EV.
          </p>
          <Link
            href="/pecas"
            className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-2.5 font-semibold text-ink transition-colors hover:bg-brand-400"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {items.map((i) => (
              <li
                key={i.partId}
                className="flex gap-4 rounded-2xl border border-line bg-card p-4"
              >
                <PartImage
                  imageKey={i.imageKey}
                  alt={i.name}
                  className="h-24 w-28 shrink-0 rounded-lg"
                  sizes="120px"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/pecas/${i.slug}`}
                      className="font-display font-semibold text-ink hover:text-brand-700"
                    >
                      {i.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(i.partId)}
                      className="text-sm text-muted-fg transition-colors hover:text-scarce"
                    >
                      Remover
                    </button>
                  </div>
                  <span className="font-mono text-[10px] text-muted-fg">
                    {i.sku}
                  </span>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center rounded-lg border border-line">
                      <button
                        type="button"
                        onClick={() => setQty(i.partId, i.quantity - 1)}
                        className="px-3 py-1 text-lg text-ink transition-colors hover:bg-muted"
                        aria-label="Diminuir"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-medium">
                        {i.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(i.partId, i.quantity + 1)}
                        className="px-3 py-1 text-lg text-ink transition-colors hover:bg-muted"
                        aria-label="Aumentar"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-display font-bold text-ink">
                      {formatPriceBRL(i.priceCents * i.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-line bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Resumo
            </h2>
            <div className="mt-4 flex justify-between text-sm text-muted-fg">
              <span>Itens ({count})</span>
              <span>{formatPriceBRL(totalCents)}</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-lg font-bold text-ink">
              <span>Total</span>
              <span>{formatPriceBRL(totalCents)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-brand-500 px-6 py-3 text-center font-semibold text-ink transition-colors hover:bg-brand-400"
            >
              Finalizar compra
            </Link>
            <Link
              href="/pecas"
              className="mt-3 block text-center text-sm font-medium text-muted-fg transition-colors hover:text-ink"
            >
              Continuar comprando
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
