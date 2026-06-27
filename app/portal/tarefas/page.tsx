import { requireStudentSession } from "@/lib/auth";
import { getStudentPortalData } from "@/lib/student-portal-data";

const statusLabels = {
  backlog: "Backlog",
  todo: "A fazer",
  doing: "Em andamento",
  review: "Em revisao",
  done: "Concluida",
} as const;

export default async function PortalTarefasPage() {
  const { user, profile } = await requireStudentSession("/portal/tarefas");
  const portal = await getStudentPortalData({
    profileId: profile.id,
    email: user.email,
  });

  if (!portal.account) {
    return (
      <section className="rounded-[2rem] border border-[var(--color-gold)]/20 bg-[var(--color-teal)]/92 p-6">
        <h2 className="font-display text-3xl text-[var(--color-gold-soft)]">
          Tarefas
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--color-gold-soft)]/72">
          Seu acesso ainda nao foi vinculado a uma matricula.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-[var(--color-gold)]/20 bg-[var(--color-teal)]/92 p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
        Execucao
      </p>
      <h2 className="mt-2 font-display text-4xl text-[var(--color-gold-soft)]">
        Suas tarefas
      </h2>

      <div className="mt-6 space-y-3">
        {portal.tasks.length === 0 ? (
          <p className="text-sm text-[var(--color-gold-soft)]/72">
            Nenhuma tarefa registrada ainda.
          </p>
        ) : (
          portal.tasks.map((task) => (
            <article
              key={task.id}
              className="rounded-[1.5rem] border border-[var(--color-gold)]/14 bg-black/12 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-[var(--color-gold-soft)]">
                    {task.title}
                  </p>
                  {task.description ? (
                    <p className="mt-2 text-sm leading-6 text-[var(--color-gold-soft)]/68">
                      {task.description}
                    </p>
                  ) : null}
                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]/76">
                    {task.area} · {task.priority}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--color-gold)]/14 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--color-gold-soft)]">
                  {statusLabels[task.status]}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
