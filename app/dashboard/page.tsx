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
    {
      label: "Por tua luz a vista",
      description: "Alunos ativos em acompanhamento no sistema.",
      value: summary.activeStudents,
    },
    {
      label: "Ordem & previsibilidade",
      description: "Leads em andamento no funil comercial.",
      value: summary.leads,
    },
    {
      label: "Domínio das ações",
      description: "Tarefas abertas para execução e revisão.",
      value: summary.openTasks,
    },
  ];

  return (
    <SiteShell
      title="Painel"
      accent="dark"
    >
      <section className="overflow-hidden rounded-lg border border-[#c8b476]/35 bg-[#cfbc79] text-[#153d4c]">
        <div
          className="relative min-h-[360px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/dashboard-bg.png')" }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,21,28,0.12),rgba(10,21,28,0.52))]" />
        </div>

        <div className="grid gap-4 px-4 py-4 lg:grid-cols-3">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="min-h-[168px] rounded-md border border-[#d7c48b] bg-[#045973] p-6 text-[#caa95d] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            >
              <p className="max-w-[16ch] font-display text-3xl leading-[0.95] uppercase">
                {metric.label}
              </p>
              <p className="mt-4 max-w-[34ch] text-sm leading-5 text-[#dcc78d]">
                {metric.description}
              </p>
              <p className="mt-5 font-display text-5xl leading-none text-[#efe1ae]">
                {String(metric.value).padStart(2, "0")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-md border border-[#c4b27b]/24 bg-[#0f5d73] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#cfbc79]">
            Gráfico
          </p>
          <h2 className="mt-2 font-display text-3xl text-[#f0e2b0]">Leads por etapa</h2>

          <div className="mt-6 space-y-4">
            {leadStageCounts.map((item) => (
              <div key={item.label} className="grid gap-2">
                <div className="flex items-center justify-between text-sm text-[#e9ddb8]/82">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-3 rounded-sm bg-black/20">
                  <div
                    className="h-3 rounded-sm bg-[#cfbc79]"
                    style={{ width: formatBar(item.value, maxLeadCount) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-[#c4b27b]/24 bg-[#0f5d73] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#cfbc79]">
            Gráfico
          </p>
          <h2 className="mt-2 font-display text-3xl text-[#f0e2b0]">Tarefas por status</h2>

          <div className="mt-6 space-y-4">
            {taskStatusCounts.map((item) => (
              <div key={item.label} className="grid gap-2">
                <div className="flex items-center justify-between text-sm text-[#e9ddb8]/82">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-3 rounded-sm bg-black/20">
                  <div
                    className="h-3 rounded-sm bg-[#d8c588]"
                    style={{ width: formatBar(item.value, maxTaskCount) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-md border border-[#c4b27b]/24 bg-[#0f5d73] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#cfbc79]">
            Tarefas do dia
          </p>
          <h2 className="mt-2 font-display text-3xl text-[#f0e2b0]">Fila de hoje</h2>

          <div className="mt-6 space-y-3">
            {tasksOfDay.length === 0 ? (
              <p className="text-sm text-[#e9ddb8]/75">Nenhuma tarefa aberta hoje.</p>
            ) : (
              tasksOfDay.map((task) => (
                <article
                  key={task.id}
                  className="rounded-md border border-white/10 bg-black/12 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#f6ebc5]">{task.title}</p>
                      <p className="mt-1 text-sm text-[#d7caa2]/70">
                        {task.area} · {task.priority}
                      </p>
                      <p className="mt-2 text-sm text-[#f6ebc5]/78">
                        {task.student_name || task.lead_name || "Sem vínculo"}
                      </p>
                    </div>
                    <span className="rounded-sm bg-[#cfbc79]/16 px-3 py-1 text-xs text-[#f0e2b0]">
                      {taskStatusLabels[task.status]}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>

        <article className="rounded-md border border-[#cfbc79]/35 bg-[#cfbc79] p-6 text-[#153d4c]">
          <p className="text-xs uppercase tracking-[0.3em] text-[#045973]">
            Resumo
          </p>
          <h2 className="mt-2 font-display text-3xl">Leitura rápida</h2>

          <div className="mt-6 space-y-3">
            <div className="rounded-md border border-[#d8c78f] bg-[#efe2b3] px-4 py-3">
              <p className="text-sm text-[#153d4c]/65">Leads em andamento</p>
              <p className="mt-1 text-2xl font-semibold">{summary.leads}</p>
            </div>
            <div className="rounded-md border border-[#d8c78f] bg-[#efe2b3] px-4 py-3">
              <p className="text-sm text-[#153d4c]/65">Tarefas abertas</p>
              <p className="mt-1 text-2xl font-semibold">{summary.openTasks}</p>
            </div>
            <div className="rounded-md border border-[#d8c78f] bg-[#efe2b3] px-4 py-3">
              <p className="text-sm text-[#153d4c]/65">Alunos ativos</p>
              <p className="mt-1 text-2xl font-semibold">{summary.activeStudents}</p>
            </div>
            <div className="rounded-md border border-[#d8c78f] bg-[#efe2b3] px-4 py-3">
              <p className="text-sm text-[#153d4c]/65">Programas ativos</p>
              <p className="mt-1 text-2xl font-semibold">{summary.activePrograms}</p>
            </div>
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
