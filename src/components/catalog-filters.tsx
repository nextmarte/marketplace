"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Brand, Category } from "@/db/schema";

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "em_falta", label: "Em falta" },
  { value: "sob_encomenda", label: "Sob encomenda" },
  { value: "disponivel", label: "Disponível" },
];

const selectClass =
  "rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink transition-colors focus:border-brand-400 focus:outline-none";

export function CatalogFilters({
  brands,
  categories,
  current,
}: {
  brands: Brand[];
  categories: Category[];
  current: {
    q?: string;
    brand?: string;
    category?: string;
    status?: string;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(current.q ?? "");

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters = Boolean(
    current.q || current.brand || current.category || current.status,
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setParam("q", q.trim());
        }}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-card px-3 py-1.5"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar peça, SKU…"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted-fg focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 text-sm font-semibold text-brand-700"
        >
          Buscar
        </button>
      </form>

      <select
        className={selectClass}
        value={current.category ?? ""}
        onChange={(e) => setParam("category", e.target.value)}
      >
        <option value="">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={current.brand ?? ""}
        onChange={(e) => setParam("brand", e.target.value)}
      >
        <option value="">Todas as marcas</option>
        {brands.map((b) => (
          <option key={b.id} value={b.slug}>
            {b.name}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={current.status ?? ""}
        onChange={(e) => setParam("status", e.target.value)}
      >
        {statusOptions.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {hasFilters && (
        <a
          href={pathname}
          className="text-sm font-medium text-muted-fg transition-colors hover:text-ink"
        >
          Limpar filtros
        </a>
      )}
    </div>
  );
}
