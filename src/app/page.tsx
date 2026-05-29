import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import {
  getFeaturedParts,
  listBrands,
  listCategories,
  listParts,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

const steps = [
  {
    n: "01",
    title: "Busque a peça",
    desc: "Filtre por marca, categoria e modelo. Veja o que está em falta nas concessionárias.",
  },
  {
    n: "02",
    title: "Solicite cotação ou compre",
    desc: "Peça uma cotação ao fornecedor ou adicione ao carrinho e finalize o pedido.",
  },
  {
    n: "03",
    title: "Receba do fornecedor",
    desc: "Vendedores verificados despacham a peça certa para o seu EV.",
  },
];

export default async function HomePage() {
  const [featured, categories, brands, all] = await Promise.all([
    getFeaturedParts(8),
    listCategories(),
    listBrands(),
    listParts(),
  ]);

  const stats = [
    { value: `${all.length}`, label: "Peças catalogadas" },
    { value: `${brands.length}`, label: "Marcas de EV" },
    { value: `${categories.length}`, label: "Categorias" },
    { value: "Zero", label: "Espera por importação" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 amp-grid opacity-40" />
        <div className="absolute inset-0 amp-glow" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <p
            className="amp-rise font-mono text-xs uppercase tracking-[0.35em] text-brand-300"
            style={{ animationDelay: "0ms" }}
          >
            Marketplace · Peças para carros elétricos
          </p>
          <h1
            className="amp-rise mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            A peça que falta na concessionária,
            <span className="text-brand-400"> você encontra aqui.</span>
          </h1>
          <p
            className="amp-rise mt-6 max-w-xl text-lg leading-relaxed text-paper/70"
            style={{ animationDelay: "160ms" }}
          >
            Freios, recarga, bateria 12V, suspensão e mais — dos itens
            notoriamente em falta para BYD, GWM, Volvo, Renault, Tesla e outras.
          </p>

          <form
            action="/pecas"
            className="amp-rise mt-8 flex max-w-xl items-center gap-2 rounded-full border border-line-dark bg-ink-2/80 p-1.5 backdrop-blur"
            style={{ animationDelay: "240ms" }}
          >
            <input
              type="search"
              name="q"
              placeholder="Buscar peça, SKU ou descrição…"
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-paper placeholder:text-paper/40 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-400"
            >
              Buscar
            </button>
          </form>

          <div
            className="amp-rise mt-4 flex flex-wrap gap-3"
            style={{ animationDelay: "320ms" }}
          >
            <Link
              href="/pecas?status=em_falta"
              className="rounded-full border border-scarce/40 bg-scarce/10 px-4 py-1.5 text-sm font-medium text-scarce transition-colors hover:bg-scarce/20"
            >
              Ver só o que está em falta →
            </Link>
            <Link
              href="/pecas"
              className="rounded-full border border-line-dark px-4 py-1.5 text-sm font-medium text-paper/80 transition-colors hover:border-brand-400 hover:text-brand-300"
            >
              Explorar catálogo
            </Link>
          </div>

          <dl
            className="amp-rise mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-line-dark pt-8 sm:grid-cols-4"
            style={{ animationDelay: "400ms" }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl font-bold text-brand-400">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-wide text-paper/50">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-fg">
              Mais procuradas
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink">
              Peças em destaque
            </h2>
          </div>
          <Link
            href="/pecas"
            className="hidden text-sm font-semibold text-brand-700 hover:text-brand-600 sm:block"
          >
            Ver todas →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((part) => (
            <ProductCard key={part.id} part={part} />
          ))}
        </div>
      </section>

      {/* CATEGORIAS + MARCAS */}
      <section id="marcas" className="bg-muted/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-ink">
            Navegue por categoria
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/pecas?category=${cat.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-lg"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-fg">{cat.description}</p>
                </div>
                <span className="font-mono text-brand-500 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ))}
          </div>

          <h2 className="mt-16 font-display text-3xl font-bold text-ink">
            Marcas atendidas
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/pecas?brand=${brand.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 transition-colors hover:border-brand-400"
              >
                <span className="font-display font-semibold text-ink">
                  {brand.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-muted-fg">
                  {brand.country}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        id="como-funciona"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6"
      >
        <h2 className="font-display text-3xl font-bold text-ink">
          Como funciona
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl border border-line bg-card p-6">
              <span className="font-mono text-sm font-bold text-brand-500">
                {s.n}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-fg">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center text-paper sm:px-12">
          <div className="absolute inset-0 amp-grid opacity-30" />
          <div className="absolute inset-0 amp-glow" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Não fique parado esperando a peça chegar.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-paper/70">
              Encontre agora a peça do seu carro elétrico e volte para a estrada.
            </p>
            <Link
              href="/pecas"
              className="mt-7 inline-block rounded-full bg-brand-500 px-7 py-3 font-semibold text-ink transition-colors hover:bg-brand-400"
            >
              Explorar catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
