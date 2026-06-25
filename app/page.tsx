import Link from "next/link";
import { SiteShell } from "@/app/_components/site-shell";
import { platformModules } from "@/lib/platform-data";

export default function Home() {
  return (
    <SiteShell
      title="Central"
      subtitle="Mentoria, CRM, tarefas e relatórios."
    >
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] bg-[var(--color-ink)] px-6 py-8 text-[var(--color-paper)] shadow-[0_30px_80px_rgba(0,0,0,0.18)] sm:px-8 sm:py-10">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-sand)]">
            Produto
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-5xl leading-none sm:text-7xl">
            Operação clara. Acesso rápido.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            Um lugar para acompanhar clientes, alunos e execução diária.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-gold)] px-6 text-sm font-semibold text-[var(--color-ink)] transition hover:brightness-105"
            >
              Abrir painel
            </Link>
          </div>
        </article>

        <article className="rounded-[2rem] border border-black/8 bg-white/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur sm:p-7">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
            Atalhos
          </p>
          <h3 className="mt-3 font-display text-4xl leading-none">
            Áreas principais
          </h3>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {platformModules.map((module) => (
              <Link
                key={module.title}
                href={
                  module.title === "Mentoria"
                    ? "/alunos"
                    : module.title === "CRM"
                      ? "/crm"
                      : module.title === "Tarefas"
                        ? "/tarefas"
                        : "/relatorios"
                }
                className="rounded-[1.5rem] border border-black/8 bg-[var(--color-paper)] px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="font-semibold">{module.title}</p>
                <p className="mt-1 text-sm text-black/55">{module.description}</p>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
