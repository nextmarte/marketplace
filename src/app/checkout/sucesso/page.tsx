import Link from "next/link";
import { formatPriceBRL } from "@/lib/format";
import { getOrderById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const order = id && /^\d+$/.test(id) ? await getOrderById(Number(id)) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-500 text-2xl font-bold text-ink shadow-[0_0_30px_-4px_rgba(3,196,137,0.8)]">
        ✓
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-ink">
        Pedido confirmado!
      </h1>

      {order ? (
        <>
          <p className="mt-3 text-muted-fg">
            Pedido <span className="font-mono text-ink">#{order.id}</span>{" "}
            registrado. Enviamos a confirmação para {order.customerEmail}.
          </p>
          <div className="mt-8 rounded-2xl border border-line bg-card p-6 text-left">
            <h2 className="font-display font-semibold text-ink">Resumo</h2>
            <ul className="mt-4 space-y-2">
              {order.items.map((it) => (
                <li
                  key={it.id}
                  className="flex justify-between gap-3 text-sm text-muted-fg"
                >
                  <span>
                    {it.quantity}× {it.part.name}
                  </span>
                  <span className="font-medium text-ink">
                    {formatPriceBRL(it.unitPriceCents * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-line pt-4 font-display font-bold text-ink">
              <span>Total</span>
              <span>{formatPriceBRL(order.totalCents)}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-3 text-muted-fg">
          Seu pedido foi registrado com sucesso.
        </p>
      )}

      <Link
        href="/pecas"
        className="mt-8 inline-block rounded-full bg-brand-500 px-6 py-3 font-semibold text-ink transition-colors hover:bg-brand-400"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
