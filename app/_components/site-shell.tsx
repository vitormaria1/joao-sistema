"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { signOut } from "@/app/bridge/login/actions";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/metodo", label: "Método" },
  { href: "/crm", label: "CRM" },
  { href: "/alunos", label: "Alunos" },
  { href: "/tarefas", label: "Tarefas" },
  { href: "/relatorios", label: "Relatórios" },
];

export function SiteShell({
  title,
  subtitle,
  children,
  accent = "light",
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  accent?: "light" | "dark";
}) {
  const dark = accent === "dark";
  const pathname = usePathname();
  return (
    <main
      className={
        dark
          ? "min-h-screen bg-[var(--color-night)] text-[var(--color-paper)]"
          : "min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]"
      }
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 lg:flex-row lg:px-6 lg:py-6">
        <aside
          className={
            dark
              ? "overflow-hidden rounded-md border border-[var(--color-gold)]/24 bg-[var(--color-teal)] shadow-[var(--shadow-panel)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-[280px]"
              : "overflow-hidden rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_16px_50px_rgba(0,0,0,0.06)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-[280px]"
          }
        >
          <div className="flex h-full flex-col">
            <div
              className={
                dark
                  ? "border-b border-[var(--color-gold)]/22 px-5 py-5"
                  : undefined
              }
            >
              <p
                className={
                  dark
                    ? "text-xs uppercase tracking-[0.35em] text-[var(--color-gold)]"
                    : "text-xs uppercase tracking-[0.35em] text-[var(--color-teal)]"
                }
              >
                Joao Sistema
              </p>
              <h1 className="mt-2 font-display text-3xl">{title}</h1>
              {subtitle ? (
                <p
                  className={
                    dark
                      ? "mt-3 text-sm leading-6 text-[var(--color-gold-soft)]/72"
                      : "mt-3 text-sm text-black/60"
                  }
                >
                  {subtitle}
                </p>
              ) : null}
            </div>

            {dark && (pathname === "/dashboard" || pathname === "/metodo") ? (
              <div
                className={
                  dark
                    ? "mx-5 mt-5 rounded-md border border-[var(--color-gold)]/24 bg-black/12 px-4 py-3"
                    : "mt-6 rounded-[1.4rem] border border-[var(--color-teal)]/20 bg-[var(--color-teal)]/8 px-4 py-3"
                }
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-current/60">
                  Aba ativa
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {pathname === "/metodo" ? "Método" : "Dashboard"}
                </p>
              </div>
            ) : null}

            <nav className={dark ? "mt-5 grid gap-2 px-5" : "mt-8 grid gap-2"}>
              {navItems.map((item) => {
                const active = pathname === item.href;
                const baseClasses =
                  dark
                    ? "flex h-11 items-center justify-between rounded-sm border px-4 text-sm transition"
                    : "flex h-11 items-center justify-between rounded-full border px-4 text-sm transition";
                const neutralClasses = dark
                  ? "border-[var(--color-gold)]/14 text-[var(--color-gold-soft)] hover:bg-black/12"
                  : "border-black/10 text-black/75 hover:bg-black/5";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.href === "/crm" ? "_blank" : undefined}
                    rel={item.href === "/crm" ? "noreferrer" : undefined}
                    className={
                      active
                        ? `${baseClasses} ${neutralClasses} font-medium ring-1 ring-current/10`
                        : `${baseClasses} ${neutralClasses}`
                    }
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    <span className={active ? "opacity-100" : "opacity-35"}>•</span>
                  </Link>
                );
              })}
            </nav>

            {dark ? (
              <form action={signOut} className="mt-auto px-5 pb-5 pt-5">
                <button
                  type="submit"
                  className="flex w-full items-center justify-between rounded-sm border border-[var(--color-gold)]/14 bg-black/12 p-4 text-sm text-[var(--color-gold-soft)] transition hover:bg-black/22"
                >
                  <span>Sair</span>
                  <span aria-hidden="true">↩</span>
                </button>
              </form>
            ) : (
              <div className="mt-auto rounded-[1.4rem] border border-black/8 bg-[var(--color-paper)] p-4 text-sm text-black/52">
                Painel de operação
              </div>
            )}
          </div>
        </aside>

        <section className="min-w-0 flex-1 space-y-6">{children}</section>
      </div>
    </main>
  );
}
