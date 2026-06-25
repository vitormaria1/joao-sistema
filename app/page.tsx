import Link from "next/link";
import { checklistSections } from "@/lib/project-checklist";
import { platformModules } from "@/lib/platform-data";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(31,103,119,0.18),transparent_32%),linear-gradient(180deg,#f6f1e8_0%,#f0e4d3_100%)] text-[var(--color-ink)]">
      <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(23,24,29,0.9),rgba(23,24,29,0))]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/30 bg-white/50 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--color-teal)]">
              João Pedro
            </p>
            <p className="font-display text-2xl leading-none">Mileto</p>
          </div>

          <nav className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-ink)] px-5 text-sm text-[var(--color-paper)] transition hover:bg-black"
            >
              Dashboard
            </Link>
            <Link
              href="/crm"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-ink)]/15 px-5 text-sm transition hover:border-[var(--color-ink)]/35"
            >
              CRM
            </Link>
            <Link
              href="/alunos"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-ink)]/15 px-5 text-sm transition hover:border-[var(--color-ink)]/35"
            >
              Alunos
            </Link>
            <Link
              href="/tarefas"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-ink)]/15 px-5 text-sm transition hover:border-[var(--color-ink)]/35"
            >
              Tarefas
            </Link>
            <Link
              href="/relatorios"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-ink)]/15 px-5 text-sm transition hover:border-[var(--color-ink)]/35"
            >
              Relatórios
            </Link>
          </nav>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[2rem] bg-[var(--color-ink)] px-6 py-8 text-[var(--color-paper)] shadow-[0_30px_80px_rgba(0,0,0,0.18)] sm:px-8 sm:py-10">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-sand)]">
              Sistema em construção
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl leading-none sm:text-7xl">
              Uma central premium para mentoria, CRM e operação dos clientes.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              A primeira versão já nasce alinhada ao posicionamento do João:
              clareza estratégica, acompanhamento real do progresso e uma
              operação menos espalhada entre ferramentas.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-gold)] px-6 text-sm font-semibold text-[var(--color-ink)] transition hover:brightness-105"
              >
                Abrir operação
              </Link>
              <a
                href="../CHECKLIST.md"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm text-white/78 transition hover:border-white/30 hover:text-white"
              >
                Ver checklist do projeto
              </a>
            </div>
          </article>

          <article className="rounded-[2rem] border border-black/8 bg-white/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur sm:p-7">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
              Status atual
            </p>
            <h2 className="mt-3 font-display text-4xl leading-none">
              Fundação iniciada
            </h2>
            <p className="mt-4 text-sm leading-7 text-black/65">
              Next.js pronto, direção visual definida, wiring de Supabase SSR
              criado e modelo inicial do domínio preparado para a próxima etapa.
            </p>

            <div className="mt-6 space-y-4">
              {checklistSections[0].items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-[1.25rem] bg-[var(--color-paper)] px-4 py-3"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                      item.done
                        ? "bg-[var(--color-teal)] text-white"
                        : "bg-black/10 text-black/55"
                    }`}
                  >
                    {item.done ? "OK" : "..."}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {platformModules.map((module) => (
            <article
              key={module.title}
              className="rounded-[1.75rem] border border-black/8 bg-white/65 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
                Módulo
              </p>
              <h3 className="mt-3 font-display text-3xl leading-none">
                {module.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-black/65">
                {module.description}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
