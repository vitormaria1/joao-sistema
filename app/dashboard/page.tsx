import { SiteShell } from "@/app/_components/site-shell";
import { requireProfile } from "@/lib/auth";
import { getDashboardSummary, getLeads, getTasks } from "@/lib/dashboard-data";

const stageLabels = {
  ativacao: "Ativação",
  investigacao: "Investigação",
  convite: "Convite",
  agendamento: "Agendamento",
  fechamento: "Fechamento",
  perdido: "Perdido",
} as const;

const taskStatusLabels = {
  backlog: "Backlog",
  todo: "A fazer",
  doing: "Fazendo",
  review: "Revisão",
  done: "Concluída",
} as const;

function getTodayInSaoPaulo() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatBar(value: number, max: number) {
  if (max <= 0) return "0%";
  return `${Math.max(8, Math.round((value / max) * 100))}%`;
}

export default async function DashboardPage() {
  const profile = await requireProfile("/dashboard");
  const [summary, leads, tasks] = await Promise.all([
    getDashboardSummary(),
    getLeads(),
    getTasks(),
  ]);

  const today = getTodayInSaoPaulo();
  const openTasks = tasks.filter((task) => task.status !== "done");
  const todayTasks = tasks.filter((task) => {
    if (task.status === "done" || !task.due_at) return false;
    return task.due_at.slice(0, 10) === today;
  });
  const tasksOfDay = todayTasks.length > 0 ? todayTasks : openTasks.slice(0, 5);

  const leadStageCounts = Object.entries(stageLabels).map(([stage, label]) => ({
    label,
    value: leads.filter((lead) => lead.stage === stage).length,
  }));

  const taskStatusCounts = Object.entries(taskStatusLabels).map(([status, label]) => ({
    label,
    value: tasks.filter((task) => task.status === status).length,
  }));

  const maxLeadCount = Math.max(1, ...leadStageCounts.map((item) => item.value));
  const maxTaskCount = Math.max(1, ...taskStatusCounts.map((item) => item.value));

  const metrics = [
    { label: "Alunos ativos", value: summary.activeStudents },
    { label: "Leads", value: summary.leads },
    { label: "Tarefas abertas", value: summary.openTasks },
    { label: "Programas ativos", value: summary.activePrograms },
  ];

  return (
    <SiteShell
      title="Painel"
      subtitle={`${profile.full_name} · números, gráficos e tarefas do dia.`}
      accent="dark"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] p-5"
          >
            <p className="text-sm text-white/60">{metric.label}</p>
            <p className="mt-4 font-display text-5xl text-[var(--color-gold)]">
              {String(metric.value).padStart(2, "0")}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
            Gráfico
          </p>
          <h2 className="mt-2 font-display text-3xl">Leads por etapa</h2>

          <div className="mt-6 space-y-4">
            {leadStageCounts.map((item) => (
              <div key={item.label} className="grid gap-2">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-3 rounded-full bg-white/8">
                  <div
                    className="h-3 rounded-full bg-[var(--color-gold)]"
                    style={{ width: formatBar(item.value, maxLeadCount) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
            Gráfico
          </p>
          <h2 className="mt-2 font-display text-3xl">Tarefas por status</h2>

          <div className="mt-6 space-y-4">
            {taskStatusCounts.map((item) => (
              <div key={item.label} className="grid gap-2">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-3 rounded-full bg-white/8">
                  <div
                    className="h-3 rounded-full bg-[var(--color-teal)]"
                    style={{ width: formatBar(item.value, maxTaskCount) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
            Tarefas do dia
          </p>
          <h2 className="mt-2 font-display text-3xl">Fila de hoje</h2>

          <div className="mt-6 space-y-3">
            {tasksOfDay.length === 0 ? (
              <p className="text-sm text-white/60">Nenhuma tarefa aberta hoje.</p>
            ) : (
              tasksOfDay.map((task) => (
                <article
                  key={task.id}
                  className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="mt-1 text-sm text-white/60">
                        {task.area} · {task.priority}
                      </p>
                      <p className="mt-2 text-sm text-white/72">
                        {task.student_name || task.lead_name || "Sem vínculo"}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--color-gold)]/15 px-3 py-1 text-xs text-[var(--color-gold)]">
                      {taskStatusLabels[task.status]}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-[#f3ede2] p-6 text-[var(--color-ink)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
            Resumo
          </p>
          <h2 className="mt-2 font-display text-3xl">Leitura rápida</h2>

          <div className="mt-6 space-y-3">
            <div className="rounded-[1.25rem] border border-black/8 bg-white px-4 py-3">
              <p className="text-sm text-black/55">Leads em andamento</p>
              <p className="mt-1 text-2xl font-semibold">{summary.leads}</p>
            </div>
            <div className="rounded-[1.25rem] border border-black/8 bg-white px-4 py-3">
              <p className="text-sm text-black/55">Tarefas abertas</p>
              <p className="mt-1 text-2xl font-semibold">{summary.openTasks}</p>
            </div>
            <div className="rounded-[1.25rem] border border-black/8 bg-white px-4 py-3">
              <p className="text-sm text-black/55">Alunos ativos</p>
              <p className="mt-1 text-2xl font-semibold">{summary.activeStudents}</p>
            </div>
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
