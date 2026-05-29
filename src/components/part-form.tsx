"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createPart,
  updatePart,
  type PartActionResult,
} from "@/app/_actions/parts";
import type { Category, Seller } from "@/db/schema";
import type { PartWithRelations } from "@/lib/queries";
import { PartImage } from "./part-image";

const statusOptions = [
  { value: "em_falta", label: "Em falta na concessionária" },
  { value: "sob_encomenda", label: "Sob encomenda" },
  { value: "disponivel", label: "Disponível" },
];

const input =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted-fg focus:border-brand-400 focus:outline-none";
const labelCls = "grid gap-1.5 text-sm font-medium text-ink";

export function PartForm({
  categories,
  sellers,
  part,
}: {
  categories: Category[];
  sellers: Seller[];
  part?: PartWithRelations;
}) {
  const action = part ? updatePart : createPart;
  const [state, formAction, pending] = useActionState<
    PartActionResult,
    FormData
  >(async (_prev, fd) => action(fd), null);

  return (
    <form action={formAction} className="grid max-w-2xl gap-4">
      {part && <input type="hidden" name="id" value={part.id} />}

      <label className={labelCls}>
        Nome
        <input name="name" required defaultValue={part?.name} className={input} />
      </label>

      <label className={labelCls}>
        Descrição
        <textarea
          name="description"
          rows={3}
          required
          defaultValue={part?.description}
          className={input}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelCls}>
          SKU
          <input name="sku" required defaultValue={part?.sku} className={input} />
        </label>
        <label className={labelCls}>
          Preço (R$, ex: 389.90)
          <input
            name="price"
            required
            defaultValue={part ? (part.priceCents / 100).toFixed(2) : ""}
            className={input}
          />
        </label>
        <label className={labelCls}>
          Categoria
          <select
            name="categoryId"
            required
            defaultValue={part ? String(part.categoryId) : ""}
            className={input}
          >
            <option value="">Selecione…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          Vendedor
          <select
            name="sellerId"
            required
            defaultValue={part ? String(part.sellerId) : ""}
            className={input}
          >
            <option value="">Selecione…</option>
            {sellers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          Status
          <select
            name="stockStatus"
            defaultValue={part?.stockStatus ?? "em_falta"}
            className={input}
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={part?.featured ?? false}
            className="h-4 w-4 accent-brand-500"
          />
          Destacar na home
        </label>
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-medium text-ink">Imagem</span>
        {part?.imageKey && (
          <PartImage
            imageKey={part.imageKey}
            alt={part.name}
            className="aspect-[4/3] w-40 rounded-lg"
            sizes="160px"
          />
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          className="text-sm text-muted-fg file:mr-3 file:rounded-full file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink"
        />
        <span className="text-xs text-muted-fg">
          Opcional. Enviada otimizada (webp) ao Cloudflare R2.
        </span>
      </div>

      {state && !state.ok && (
        <p className="text-sm font-medium text-scarce">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand-500 px-6 py-2.5 font-semibold text-ink transition-colors hover:bg-brand-400 disabled:opacity-60"
        >
          {pending ? "Salvando…" : part ? "Salvar alterações" : "Criar peça"}
        </button>
        <Link
          href="/admin/pecas"
          className="text-sm font-medium text-muted-fg hover:text-ink"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
