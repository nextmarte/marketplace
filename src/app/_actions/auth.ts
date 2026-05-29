"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, sessionToken, verifyCredentials } from "@/lib/auth";

export type LoginResult = { ok: false; error: string } | null;

export async function login(formData: FormData): Promise<LoginResult> {
  const user = String(formData.get("user") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(user, password)) {
    return { ok: false, error: "Usuário ou senha inválidos." };
  }

  (await cookies()).set(SESSION_COOKIE, await sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
