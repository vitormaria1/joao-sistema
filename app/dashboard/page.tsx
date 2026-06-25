import Link from "next/link";
import { createLead, createProgram } from "@/app/dashboard/actions";
import { getCurrentProfile } from "@/lib/auth";
import { getPrograms, getLeads } from "@/lib/dashboard-data";
import { getDatabaseHealth } from "@/lib/db";
import { checklistSections } from "@/lib/project-checklist";
import { dashboardMetrics, weeklyFlow } from "@/lib/platform-data";

const stageLabels = {
  ativacao: "Ativação",
  investigacao: "Investigação",
  convite: "Convite",
  agendamento: "Agendamento",
  fechamento: "Fechamento",
  perdido: "Perdido",
};

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  const dbHealth = await getDatabaseHealth().catch(() => null);
  const [programs, leads] = await Promise.all([getPrograms(), getLeads()]);

  return (
    <main className="min-h-screen bg-[var(--color-ink)] text-[var(--color-paper)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-[var(--color-gold)]/30 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
              Joao Sistema
            </span>
            <div>
              <h1 className="font-display text-4xl leading-none sm:text-5xl">
                Painel de operação
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                Modo de desenvolvimento sem login, já operando com Postgres real.
              </p>
              <p className="mt-3 text-sm text-[var(--color-sand)]">
                {profile.full_name} · {profile.role}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm text-white/80 transition hover:border-[var(--color-gold)]/40 hover:text-white"
          >
            Visão geral
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] p-5"
            >
              <p className="text-sm text-white/60">{metric.label}</p>
              <p className="mt-4 font-display text-5xl text-[var(--color-gold)]">
                {metric.value}
              </p>
              <p className="mt-3 text-sm text-white/65">{metric.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-[1.75rem] border border-white/10 bg-[var(--color-teal)]/18 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
              Banco
            </p>
            <h2 className="mt-3 font-display text-3xl">Conexão atual</h2>
            {dbHealth ? (
              <div className="mt-5 space-y-2 text-sm text-white/75">
                <p>Banco: {dbHealth.database_name}</p>
                <p>Schema: {dbHealth.schema_name}</p>
                <p>Servidor: {dbHealth.server_time}</p>
              </div>
            ) : (
              <p className="mt-5 text-sm text-white/70">
                Conexão ainda não validada no runtime da página.
              </p>
            )}
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
              Build atual
            </p>
            <h2 className="mt-3 font-display text-3xl">
              CRM e programas já persistindo
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
              O painel abaixo já grava no Supabase. Neste estágio, priorizamos a
              operação e deixamos o controle de acessos para a fase final.
            </p>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2rem] border border-white/10 bg-[#f3ede2] p-6 text-[var(--color-ink)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
              Programas
            </p>
            <h2 className="mt-2 font-display text-3xl">Cadastrar oferta</h2>

            <form action={createProgram} className="mt-6 grid gap-3 md:grid-cols-2">
              <input
                name="name"
                placeholder="Nome do programa"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
                required
              />
              <input
                name="slug"
                placeholder="Slug"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
                required
              />
              <select
                name="kind"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
                defaultValue="candeeiro"
              >
                <option value="candeeiro">Candeeiro</option>
                <option value="vigilia">Vigília</option>
              </select>
              <input
                name="durationWeeks"
                type="number"
                min="1"
                max="52"
                defaultValue="6"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
              />
              <label className="col-span-full flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm">
                <input type="checkbox" name="isActive" defaultChecked />
                Programa ativo
              </label>
              <button
                type="submit"
                className="col-span-full inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-ink)] px-6 text-sm font-semibold text-[var(--color-paper)]"
              >
                Salvar programa
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {programs.length === 0 ? (
                <p className="text-sm text-black/60">Nenhum programa cadastrado.</p>
              ) : (
                programs.map((program) => (
                  <div
                    key={program.id}
                    className="rounded-[1.25rem] border border-black/8 bg-white px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{program.name}</p>
                        <p className="text-sm text-black/55">
                          {program.slug} · {program.kind} · {program.duration_weeks} semanas
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          program.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-zinc-200 text-zinc-700"
                        }`}
                      >
                        {program.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
                  Fluxo central
                </p>
                <h2 className="mt-2 font-display text-3xl">
                  Timeline do Candeeiro
                </h2>
              </div>
              <span className="rounded-full bg-[var(--color-gold)]/15 px-3 py-1 text-xs text-[var(--color-gold)]">
                6 semanas
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              {weeklyFlow.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-[1.5rem] border border-white/8 bg-black/10 px-4 py-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-teal)] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-6 text-white/75">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
              CRM
            </p>
            <h2 className="mt-2 font-display text-3xl">Novo lead</h2>

            <form action={createLead} className="mt-6 grid gap-3 md:grid-cols-2">
              <input
                name="name"
                placeholder="Nome do lead"
                className="h-12 rounded-2xl border border-white/10 bg-black/10 px-4 text-white"
                required
              />
              <select
                name="stage"
                className="h-12 rounded-2xl border border-white/10 bg-black/10 px-4 text-white"
                defaultValue="ativacao"
              >
                {Object.entries(stageLabels).map(([value, label]) => (
                  <option key={value} value={value} className="text-black">
                    {label}
                  </option>
                ))}
              </select>
              <input
                name="whatsapp"
                placeholder="WhatsApp"
                className="h-12 rounded-2xl border border-white/10 bg-black/10 px-4 text-white"
              />
              <input
                name="instagram"
                placeholder="Instagram"
                className="h-12 rounded-2xl border border-white/10 bg-black/10 px-4 text-white"
              />
              <input
                name="source"
                placeholder="Origem"
                className="h-12 rounded-2xl border border-white/10 bg-black/10 px-4 text-white"
              />
              <input
                name="nextAction"
                placeholder="Próxima ação"
                className="h-12 rounded-2xl border border-white/10 bg-black/10 px-4 text-white"
              />
              <input
                name="nextActionAt"
                type="datetime-local"
                className="h-12 rounded-2xl border border-white/10 bg-black/10 px-4 text-white"
              />
              <textarea
                name="notes"
                placeholder="Observações"
                className="min-h-32 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white md:col-span-2"
              />
              <button
                type="submit"
                className="md:col-span-2 inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-gold)] px-6 text-sm font-semibold text-[var(--color-ink)]"
              >
                Salvar lead
              </button>
            </form>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-[#f3ede2] p-6 text-[var(--color-ink)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
              Pipeline atual
            </p>
            <h2 className="mt-2 font-display text-3xl">Leads cadastrados</h2>
            <div className="mt-6 space-y-3">
              {leads.length === 0 ? (
                <p className="text-sm text-black/60">Nenhum lead cadastrado.</p>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-[1.25rem] border border-black/8 bg-white px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold">{lead.name}</p>
                        <p className="text-sm text-black/55">
                          {lead.whatsapp || "Sem WhatsApp"} · {lead.instagram || "Sem Instagram"}
                        </p>
                        <p className="mt-2 text-sm text-black/65">
                          Origem: {lead.source || "Não informada"}
                        </p>
                        {lead.next_action ? (
                          <p className="text-sm text-black/65">
                            Próxima ação: {lead.next_action}
                          </p>
                        ) : null}
                        {lead.notes ? (
                          <p className="mt-2 text-sm leading-6 text-black/70">
                            {lead.notes}
                          </p>
                        ) : null}
                      </div>
                      <span className="rounded-full bg-[var(--color-teal)]/12 px-3 py-1 text-xs text-[var(--color-teal)]">
                        {stageLabels[lead.stage]}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#f3ede2] p-6 text-[var(--color-ink)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
            Execução
          </p>
          <h2 className="mt-2 font-display text-3xl">Checklist vivo</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {checklistSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold">{section.title}</h3>
                <div className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3"
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                          item.done
                            ? "bg-[var(--color-teal)] text-white"
                            : "bg-black/10 text-black/60"
                        }`}
                      >
                        {item.done ? "OK" : "..."}
                      </span>
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
