import { SiteShell } from "@/app/_components/site-shell";
import {
  createAttachment,
  createTask,
  updateTaskStatus,
} from "@/app/dashboard/actions";
import { requireAdminSession } from "@/lib/auth";
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
  const { profile } = await requireAdminSession("/tarefas");
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
            className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] p-5"
          >
            <p className="text-sm text-white/60">{metric.label}</p>
            <p className="mt-4 font-display text-5xl text-[var(--color-gold)]">
              {String(metric.value).padStart(2, "0")}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-[2rem] border border-white/10 bg-[#f3ede2] p-6 text-[var(--color-ink)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
            Nova tarefa
          </p>
          <h2 className="mt-2 font-display text-3xl">Entrada rápida</h2>

          <details className="mt-6 rounded-[1.5rem] border border-black/8 bg-white px-4 py-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-[var(--color-ink)]">
              Abrir formulário
            </summary>

            <form action={createTask} className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                name="title"
                placeholder="Título"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
                required
              />
              <select
                name="area"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
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
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
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
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
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
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
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
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
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
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
              />
              <label className="col-span-full flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm">
                <input type="checkbox" name="isRecurring" />
                Recorrente
              </label>
              <textarea
                name="description"
                placeholder="Descrição"
                className="min-h-28 rounded-2xl border border-black/10 bg-white px-4 py-3 md:col-span-2"
              />
              <button
                type="submit"
                className="md:col-span-2 inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-ink)] px-6 text-sm font-semibold text-[var(--color-paper)]"
              >
                Salvar tarefa
              </button>
            </form>
          </details>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
            Fluxo
          </p>
          <h2 className="mt-2 font-display text-3xl">Kanban atual</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {(
              Object.entries(groupedTasks) as [keyof typeof groupedTasks, (typeof tasks)[number][]][]
            ).map(([status, items]) => (
              <div
                key={status}
                className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{statusLabels[status]}</h3>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/75">
                    {items.length}
                  </span>
                </div>

                <div className="mt-3 space-y-3">
                  {items.length === 0 ? (
                    <p className="text-sm text-white/55">Sem tarefas.</p>
                  ) : (
                    items.map((task) => {
                      const taskAttachments = attachmentsByTask
                        .filter((item) => item.entity_id === task.id)
                        .slice(0, 2);

                      return (
                        <article
                          key={task.id}
                          className="rounded-[1.25rem] border border-white/10 bg-white/5 p-3"
                        >
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs text-white/55">
                            {areaLabels[task.area]} · {priorityLabels[task.priority]}
                          </p>
                          <p className="mt-2 text-sm text-white/65">
                            {task.student_name || task.lead_name || "Sem vínculo"}
                          </p>

                          <div className="mt-3 space-y-2">
                            {taskAttachments.map((item) => (
                              <a
                                key={item.id}
                                href={item.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75"
                              >
                                {item.title} · {item.kind}
                              </a>
                            ))}
                          </div>

                          <details className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                            <summary className="cursor-pointer list-none text-xs text-white/75">
                              Mover / anexar
                            </summary>

                            <form action={updateTaskStatus} className="mt-3">
                              <input type="hidden" name="taskId" value={task.id} />
                              <select
                                name="status"
                                defaultValue={task.status}
                                className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                              >
                                {Object.entries(statusLabels).map(([value, label]) => (
                                  <option key={value} value={value} className="text-black">
                                    {label}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="submit"
                                className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-full bg-white/10 text-xs text-white"
                              >
                                Atualizar
                              </button>
                            </form>

                            <form action={createAttachment} className="mt-3 grid gap-2">
                              <input type="hidden" name="entityType" value="task" />
                              <input type="hidden" name="entityId" value={task.id} />
                              <input
                                name="title"
                                placeholder="Título do material"
                                className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                              />
                              <input
                                name="fileUrl"
                                placeholder="URL do arquivo"
                                className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                              />
                              <select
                                name="kind"
                                defaultValue="attachment"
                                className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
                              >
                                <option value="attachment" className="text-black">
                                  Anexo
                                </option>
                                <option value="material" className="text-black">
                                  Material
                                </option>
                              </select>
                              <button
                                type="submit"
                                className="inline-flex h-10 items-center justify-center rounded-full bg-white/10 text-xs text-white"
                              >
                                Adicionar
                              </button>
                            </form>
                          </details>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
