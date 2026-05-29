"use client";

import { useActionState } from "react";
import { submitLead, type LeadResult } from "@/app/_actions/leads";

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted-fg focus:border-brand-400 focus:outline-none";

export function QuoteForm({
  partId,
  partName,
}: {
  partId: number;
  partName: string;
}) {
  const [state, action, pending] = useActionState<LeadResult | null, FormData>(
    async (_prev, formData) => submitLead(formData),
    null,
  );

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-brand-400 bg-brand-50 p-6 text-center">
        <p className="font-display text-lg font-semibold text-brand-800">
          Cotação enviada! ✓
        </p>
        <p className="mt-2 text-sm text-brand-700">
          Em breve um fornecedor entra em contato sobre {partName}.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="partId" value={partId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Seu nome" className={inputClass} />
        <input
          name="email"
          type="email"
          required
          placeholder="E-mail"
          className={inputClass}
        />
        <input
          name="phone"
          placeholder="Telefone (opcional)"
          className={inputClass}
        />
        <input
          name="quantity"
          type="number"
          min={1}
          defaultValue={1}
          placeholder="Quantidade"
          className={inputClass}
        />
      </div>
      <textarea
        name="message"
        rows={3}
        placeholder="Mensagem (opcional)"
        className={inputClass}
      />
      {state && !state.ok && (
        <p className="text-sm font-medium text-scarce">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-ink transition-colors hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar cotação"}
      </button>
    </form>
  );
}
