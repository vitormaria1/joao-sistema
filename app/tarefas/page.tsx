import { SiteShell } from "@/app/_components/site-shell";
import { createTask } from "@/app/dashboard/actions";
import { requireProfile } from "@/lib/auth";
import { getAttachments, getLeads, getStudents, getTasks } from "@/lib/dashboard-data";

const statusLabels = {
  backlog: "Backlog",
  todo: "A fazer",
  doing: "Fazendo",
  review: "Revisão",
  done: "Concluída",
};

const areaLabels = {
  gestao: "Gestão",
  atendimento: "Atendimento",
  marketing: "Marketing",
  vendas: "Vendas",
};

const priorityLabels = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
};

export default async function TarefasPage() {
  const profile = await requireProfile("/tarefas");
  const [tasks, students, leads, attachments] = await Promise.all([
    getTasks(),
    getStudents(),
    getLeads(),
    getAttachments(),
  ]);
  const attachmentsByTask = attachments.filter((item) => item.entity_type === "task");

  const groupedTasks = {
    backlog: tasks.filter((task) => task.status === "backlog"),
    todo: tasks.filter((task) => task.status === "todo"),
    doing: tasks.filter((task) => task.status === "doing"),
    review: tasks.filter((task) => task.status === "review"),
    done: tasks.filter((task) => task.status === "done"),
  } as const;

  const taskMetrics = [
    { label: "Tarefas", value: tasks.length },
    {
      label: "Abertas",
      value: tasks.filter((task) => task.status !== "done").length,
    },
    {
      label: "Urgentes",
      value: tasks.filter((task) => task.priority === "urgente").length,
    },
    { label: "Anexos", value: attachmentsByTask.length },
  ];

  const areaCounts = Object.entries(areaLabels).map(([area, label]) => ({
    label,
    value: tasks.filter((task) => task.area === area).length,
  }));

  const statusCounts = Object.entries(groupedTasks).map(([status, items]) => ({
    label: statusLabels[status as keyof typeof statusLabels],
    value: items.length,
  }));

  const maxAreaCount = Math.max(1, ...areaCounts.map((item) => item.value));
  const maxStatusCount = Math.max(1, ...statusCounts.map((item) => item.value));
  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round((groupedTasks.done.length / tasks.length) * 100);
  const urgentOpenCount = tasks.filter(
    (task) => task.priority === "urgente" && task.status !== "done",
  ).length;

  function formatBar(value: number, max: number) {
    if (max <= 0) return "0%";
    return `${Math.max(8, Math.round((value / max) * 100))}%`;
  }

  return (
    <SiteShell
      title="Tarefas"
      subtitle={`${profile.full_name} · execução e prioridades.`}
      accent="dark"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {taskMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-md border border-[#c4b27b]/24 bg-[#0f5d73] p-5"
          >
            <p className="text-sm text-[#efe2b3]/72">{metric.label}</p>
            <p className="mt-4 font-display text-5xl text-[#cfbc79]">
              {String(metric.value).padStart(2, "0")}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-md border border-[#cfbc79]/35 bg-[#cfbc79] p-6 text-[#153d4c]">
          <p className="text-xs uppercase tracking-[0.3em] text-[#045973]">
            Nova tarefa
          </p>
          <h2 className="mt-2 font-display text-3xl">Entrada rápida</h2>

          <details className="mt-6 rounded-md border border-[#b89e5a]/26 bg-[#efe2b3] px-4 py-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-[var(--color-ink)]">
              Abrir formulário
            </summary>

            <form action={createTask} className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                name="title"
                placeholder="Título"
                className="h-12 rounded-md border border-[#b89e5a]/26 bg-[#f7edc5] px-4"
                required
              />
              <select
                name="area"
                className="h-12 rounded-md border border-[#b89e5a]/26 bg-[#f7edc5] px-4"
                defaultValue="gestao"
              >
                {Object.entries(areaLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                name="priority"
                className="h-12 rounded-md border border-[#b89e5a]/26 bg-[#f7edc5] px-4"
                defaultValue="media"
              >
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                name="status"
                className="h-12 rounded-md border border-[#b89e5a]/26 bg-[#f7edc5] px-4"
                defaultValue="todo"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                name="studentAccountId"
                className="h-12 rounded-md border border-[#b89e5a]/26 bg-[#f7edc5] px-4"
                defaultValue=""
              >
                <option value="">Sem aluno</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.student_name}
                  </option>
                ))}
              </select>
              <select
                name="leadId"
                className="h-12 rounded-md border border-[#b89e5a]/26 bg-[#f7edc5] px-4"
                defaultValue=""
              >
                <option value="">Sem lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name}
                  </option>
                ))}
              </select>
              <input
                name="dueAt"
                type="datetime-local"
                className="h-12 rounded-md border border-[#b89e5a]/26 bg-[#f7edc5] px-4"
              />
              <label className="col-span-full flex items-center gap-3 rounded-md bg-[#f7edc5] px-4 py-3 text-sm">
                <input type="checkbox" name="isRecurring" />
                Recorrente
              </label>
              <textarea
                name="description"
                placeholder="Descrição"
                className="min-h-28 rounded-md border border-[#b89e5a]/26 bg-[#f7edc5] px-4 py-3 md:col-span-2"
              />
              <button
                type="submit"
                className="md:col-span-2 inline-flex h-12 items-center justify-center rounded-sm bg-[#045973] px-6 text-sm font-semibold text-[#efe2b3]"
              >
                Salvar tarefa
              </button>
            </form>
          </details>
        </article>

        <article className="rounded-md border border-[#c4b27b]/24 bg-[#0f5d73] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#cfbc79]">
            Gráficos
          </p>
          <h2 className="mt-2 font-display text-3xl text-[#f0e2b0]">Pulso das tarefas</h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-md border border-white/10 bg-black/12 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#cfbc79]/90">
                Conclusão
              </p>
              <p className="mt-3 font-display text-5xl text-[#f0e2b0]">
                {String(completionRate).padStart(2, "0")}%
              </p>
              <p className="mt-2 text-sm text-[#efe2b3]/70">
                Percentual já finalizado dentro do volume total.
              </p>
            </div>

            <div className="rounded-md border border-white/10 bg-black/12 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#cfbc79]/90">
                Pressão
              </p>
              <p className="mt-3 font-display text-5xl text-[#f0e2b0]">
                {String(urgentOpenCount).padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm text-[#efe2b3]/70">
                Tarefas urgentes ainda abertas para ação imediata.
              </p>
            </div>

            <div className="rounded-md border border-white/10 bg-black/12 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#cfbc79]/90">
                Arquivo
              </p>
              <p className="mt-3 font-display text-5xl text-[#f0e2b0]">
                {String(attachmentsByTask.length).padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm text-[#efe2b3]/70">
                Materiais e anexos vinculados às execuções.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-md border border-white/10 bg-black/12 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#cfbc79]/90">
                Por status
              </p>
              <div className="mt-4 space-y-4">
                {statusCounts.map((item) => (
                  <div key={item.label} className="grid gap-2">
                    <div className="flex items-center justify-between text-sm text-[#e9ddb8]/82">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="h-3 rounded-sm bg-black/20">
                      <div
                        className="h-3 rounded-sm bg-[#d8c588]"
                        style={{ width: formatBar(item.value, maxStatusCount) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-white/10 bg-black/12 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#cfbc79]/90">
                Por área
              </p>
              <div className="mt-4 space-y-4">
                {areaCounts.map((item) => (
                  <div key={item.label} className="grid gap-2">
                    <div className="flex items-center justify-between text-sm text-[#e9ddb8]/82">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="h-3 rounded-sm bg-black/20">
                      <div
                        className="h-3 rounded-sm bg-[#cfbc79]"
                        style={{ width: formatBar(item.value, maxAreaCount) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
