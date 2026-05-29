import Link from "next/link";
import { logout } from "@/app/_actions/auth";
import { formatPriceBRL } from "@/lib/format";
import { listLeads, listOrders, listParts } from "@/lib/queries";

export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  const [parts, leads, orders] = await Promise.all([
    listParts(),
    listLeads(8),
    listOrders(8),
  ]);

  const stats = [
    { label: "Peças cadastradas", value: parts.length },
    { label: "Cotações recebidas", value: leads.length },
    { label: "Pedidos", value: orders.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
            Painel
          </p>
          <h1 className="font-display text-3xl font-bold text-ink">
            Administração
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pecas"
            className="rounded-full bg-brand-500 px-5 py-2.5 font-semibold text-ink transition-colors hover:bg-brand-400"
          >
            Gerenciar peças
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-line px-4 py-2.5 text-sm font-medium text-muted-fg transition-colors hover:text-ink"
            >
              Sair
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-card p-5">
            <div className="font-display text-3xl font-bold text-ink">
              {s.value}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wide text-muted-fg">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink">
            Cotações recentes
          </h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-card">
            {leads.length === 0 ? (
              <p className="p-5 text-sm text-muted-fg">Nenhuma cotação ainda.</p>
            ) : (
              <ul className="divide-y divide-line">
                {leads.map((l) => (
                  <li key={l.id} className="flex justify-between gap-3 p-4 text-sm">
                    <div>
                      <p className="font-medium text-ink">{l.name}</p>
                      <p className="text-muted-fg">{l.email}</p>
                    </div>
                    <div className="text-right text-muted-fg">
                      <p>Qtd: {l.quantity}</p>
                      <p className="font-mono text-xs">{fmtDate(l.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">
            Pedidos recentes
          </h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-card">
            {orders.length === 0 ? (
              <p className="p-5 text-sm text-muted-fg">Nenhum pedido ainda.</p>
            ) : (
              <ul className="divide-y divide-line">
                {orders.map((o) => (
                  <li key={o.id} className="flex justify-between gap-3 p-4 text-sm">
                    <div>
                      <p className="font-medium text-ink">
                        #{o.id} · {o.customerName}
                      </p>
                      <p className="text-muted-fg">{o.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-ink">
                        {formatPriceBRL(o.totalCents)}
                      </p>
                      <p className="font-mono text-xs text-muted-fg">
                        {fmtDate(o.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
