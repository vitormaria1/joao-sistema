"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Método" },
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
  const router = useRouter();

  return (
    <main
      className={
        dark
          ? "min-h-screen bg-[linear-gradient(180deg,#17181d_0%,#20222a_100%)] text-[var(--color-paper)]"
          : "min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]"
      }
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 lg:flex-row lg:px-6 lg:py-6">
        <aside
          className={
            dark
              ? "rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-[280px]"
              : "rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_16px_50px_rgba(0,0,0,0.06)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-[280px]"
          }
        >
          <div className="flex h-full flex-col">
            <div>
              <p
                className={
                  dark
                    ? "text-xs uppercase tracking-[0.35em] text-[var(--color-sand)]"
                    : "text-xs uppercase tracking-[0.35em] text-[var(--color-teal)]"
                }
              >
                Joao Sistema
              </p>
              <h1 className="mt-2 font-display text-3xl">{title}</h1>
              <p
                className={
                  dark
                    ? "mt-3 text-sm text-white/68"
                    : "mt-3 text-sm text-black/60"
                }
              >
                {subtitle}
              </p>
            </div>

            <nav className="mt-8 grid gap-2">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => router.push(item.href)}
                    className={
                      dark
                        ? `flex h-11 items-center justify-between rounded-full px-4 text-sm transition ${
                            active
                              ? "bg-[var(--color-gold)] text-[var(--color-ink)]"
                              : "border border-white/10 text-white/78 hover:bg-white/5"
                          }`
                        : `flex h-11 items-center justify-between rounded-full px-4 text-sm transition ${
                            active
                              ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                              : "border border-black/10 text-black/75 hover:bg-black/5"
                          }`
                    }
                  >
                    <span>{item.label}</span>
                    <span className={active ? "opacity-100" : "opacity-35"}>•</span>
                  </button>
                );
              })}
            </nav>

            <div
              className={
                dark
                  ? "mt-auto rounded-[1.4rem] border border-white/10 bg-black/10 p-4 text-sm text-white/58"
                  : "mt-auto rounded-[1.4rem] border border-black/8 bg-[var(--color-paper)] p-4 text-sm text-black/52"
              }
            >
              Painel de operação
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1 space-y-6">{children}</section>
      </div>
    </main>
  );
}
