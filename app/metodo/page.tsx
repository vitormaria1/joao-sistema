import { SiteShell } from "@/app/_components/site-shell";
import { MethodPanel } from "@/app/dashboard/_components/method-panel";
import { createLead, createProgram } from "@/app/dashboard/actions";
import { getCurrentProfile } from "@/lib/auth";
import {
  getDashboardSummary,
  getPrograms,
  getLeads,
} from "@/lib/dashboard-data";
import { weeklyFlow } from "@/lib/platform-data";

const stageLabels = {
  ativacao: "Ativação",
  investigacao: "Investigação",
  convite: "Convite",
  agendamento: "Agendamento",
  fechamento: "Fechamento",
  perdido: "Perdido",
};

export default async function MetodoPage() {
  const profile = await getCurrentProfile();
  const [programs, leads, summary] = await Promise.all([
    getPrograms(),
    getLeads(),
    getDashboardSummary(),
  ]);

  const dashboardMetrics = [
    {
      label: "Alunos ativos",
      value: String(summary.activeStudents).padStart(2, "0"),
      detail: "Matrículas em andamento",
    },
    {
      label: "Leads no funil",
      value: String(summary.leads).padStart(2, "0"),
      detail: "Cadastros comerciais",
    },
    {
      label: "Tarefas abertas",
      value: String(summary.openTasks).padStart(2, "0"),
      detail: "Fila operacional",
    },
    {
      label: "Programas ativos",
      value: String(summary.activePrograms).padStart(2, "0"),
      detail: "Candeeiro e Vigília",
    },
  ];

  return (
    <SiteShell
      title="Método"
      subtitle={`${profile.full_name} · evolução do aluno, materiais e execução.`}
      accent="dark"
    >
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

      <MethodPanel />

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
                Método
              </p>
              <h2 className="mt-2 font-display text-3xl">Semana a semana</h2>
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

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
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
            Pipeline
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
                        {lead.next_action || "Sem próxima ação"}
                      </p>
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
    </SiteShell>
  );
}
