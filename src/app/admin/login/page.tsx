"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login, type LoginResult } from "@/app/_actions/auth";

const input =
  "w-full rounded-lg border border-line-dark bg-ink-2 px-3 py-2.5 text-sm text-paper placeholder:text-paper/40 focus:border-brand-400 focus:outline-none";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<LoginResult, FormData>(
    async (_prev, formData) => login(formData),
    null,
  );

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-ink px-4 py-16">
      <div className="absolute inset-0 amp-grid opacity-40" />
      <div className="absolute inset-0 amp-glow" />

      <div className="relative w-full max-w-sm rounded-3xl border border-line-dark bg-ink-2/70 p-8 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Amperia"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <span className="font-display text-xl font-extrabold tracking-tight text-paper">
            Amperia
          </span>
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold text-paper">
          Painel administrativo
        </h1>
        <p className="mt-1 text-sm text-paper/60">
          Entre para gerenciar peças, cotações e pedidos.
        </p>

        <form action={action} className="mt-6 grid gap-3">
          <input
            name="user"
            placeholder="Usuário"
            autoComplete="username"
            required
            className={input}
          />
          <input
            name="password"
            type="password"
            placeholder="Senha"
            autoComplete="current-password"
            required
            className={input}
          />
          {state && !state.ok && (
            <p className="text-sm font-medium text-scarce">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="mt-1 rounded-full bg-brand-500 px-6 py-2.5 font-semibold text-ink transition-colors hover:bg-brand-400 disabled:opacity-60"
          >
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
