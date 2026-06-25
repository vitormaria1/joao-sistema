import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Painel" },
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

  return (
    <main
      className={
        dark
          ? "min-h-screen bg-[linear-gradient(180deg,#17181d_0%,#20222a_100%)] text-[var(--color-paper)]"
          : "min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]"
      }
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        <header
          className={
            dark
              ? "flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:flex-row sm:items-end sm:justify-between"
              : "flex flex-col gap-4 rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.06)] sm:flex-row sm:items-end sm:justify-between"
          }
        >
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
            <h1 className="mt-2 font-display text-4xl">{title}</h1>
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

          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  dark
                    ? "inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm text-white/80"
                    : "inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm text-black/75"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {children}
      </div>
    </main>
  );
}
