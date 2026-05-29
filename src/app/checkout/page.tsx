"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { submitOrder } from "@/app/_actions/orders";
import { useCart } from "@/components/cart-provider";
import { formatPriceBRL } from "@/lib/format";

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted-fg focus:border-brand-400 focus:outline-none";

export default function CheckoutPage() {
  const { items, totalCents, count, clear } = useCart();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (count === 0 && !pending) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-ink">
          Nada para finalizar
        </h1>
        <p className="mt-2 text-muted-fg">Seu carrinho está vazio.</p>
        <Link
          href="/pecas"
          className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-2.5 font-semibold text-ink transition-colors hover:bg-brand-400"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const res = await submitOrder({
      customerName: String(fd.get("customerName") ?? ""),
      customerEmail: String(fd.get("customerEmail") ?? ""),
      customerPhone: String(fd.get("customerPhone") ?? "") || undefined,
      address: String(fd.get("address") ?? ""),
      items: items.map((i) => ({ partId: i.partId, quantity: i.quantity })),
    });
    if (res.ok) {
      const orderId = res.orderId;
      clear();
      router.push(`/checkout/sucesso?id=${orderId}`);
    } else {
      setError(res.error);
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">
        Finalizar compra
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-ink">Nome completo</span>
              <input name="customerName" required className={inputClass} />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-ink">E-mail</span>
              <input
                name="customerEmail"
                type="email"
                required
                className={inputClass}
              />
            </label>
          </div>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-ink">
              Telefone (opcional)
            </span>
            <input name="customerPhone" className={inputClass} />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-ink">
              Endereço de entrega
            </span>
            <textarea name="address" rows={3} required className={inputClass} />
          </label>

          {error && (
            <p className="text-sm font-medium text-scarce">{error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-ink transition-colors hover:bg-brand-400 disabled:opacity-60"
          >
            {pending ? "Processando…" : `Confirmar pedido · ${formatPriceBRL(totalCents)}`}
          </button>
          <p className="text-xs text-muted-fg">
            Pagamento simulado — nenhuma cobrança é feita nesta demonstração.
          </p>
        </form>

        <aside className="h-fit rounded-2xl border border-line bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Seu pedido
          </h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.partId} className="flex justify-between gap-3 text-sm">
                <span className="text-muted-fg">
                  {i.quantity}× {i.name}
                </span>
                <span className="font-medium text-ink">
                  {formatPriceBRL(i.priceCents * i.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-lg font-bold text-ink">
            <span>Total</span>
            <span>{formatPriceBRL(totalCents)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
