import { requireStudentSession } from "@/lib/auth";
import { getStudentPortalData } from "@/lib/student-portal-data";

function formatDate(date: string | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
  }).format(new Date(date));
}

export default async function PortalPage() {
  const { user, profile } = await requireStudentSession("/portal");
  const portal = await getStudentPortalData({
    profileId: profile.id,
    email: user.email,
  });

  if (!portal.account) {
    return (
      <section className="overflow-hidden rounded-[2rem] border border-[var(--color-gold)]/24 bg-[linear-gradient(180deg,rgba(15,93,115,0.96),rgba(13,24,32,0.98))] p-8 shadow-[var(--shadow-panel)]">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-gold)]">
          Portal do aluno
        </p>
        <h2 className="mt-4 max-w-[12ch] font-display text-5xl leading-none text-[var(--color-gold-soft)]">
          Sua jornada ja esta pronta.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-gold-soft)]/76">
          Ainda nao encontramos uma matricula vinculada a este acesso. Assim que a
          equipe conectar seu e-mail ao programa, este portal passa a mostrar
          progresso, materiais e proximos passos.
        </p>
      </section>
    );
  }

  const currentWeekMaterials = portal.materials.filter(
    (material) => material.week_number === portal.account?.week_number,
  );
  const openTasks = portal.tasks.filter((task) => task.status !== "done");

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-[var(--color-gold)]/26 bg-[linear-gradient(120deg,rgba(15,93,115,0.96),rgba(13,24,32,1))] shadow-[var(--shadow-panel)]">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-8 lg:py-10">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-gold)]">
              Jornada ativa
            </p>
            <h2 className="mt-4 max-w-[12ch] font-display text-5xl leading-none text-[var(--color-gold-soft)] sm:text-6xl">
              {portal.account.program_name}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-gold-soft)]/74">
              Sua semana atual, seus materiais e o proximo trecho da caminhada estao
              aqui.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-gold-soft)]/72">
              <span className="rounded-full border border-[var(--color-gold)]/18 bg-black/12 px-4 py-2">
                Semana {portal.account.week_number} de {portal.account.duration_weeks}
              </span>
              <span className="rounded-full border border-[var(--color-gold)]/18 bg-black/12 px-4 py-2">
                {portal.phase}
              </span>
              <span className="rounded-full border border-[var(--color-gold)]/18 bg-black/12 px-4 py-2">
                {portal.account.status}
              </span>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--color-gold)]/18 bg-black/14 p-5">
            <p className="text-sm text-[var(--color-gold-soft)]/68">Seu progresso</p>
            <p className="mt-3 font-display text-6xl leading-none text-[var(--color-gold-soft)]">
              {portal.progressPercent}%
            </p>
            <div className="mt-5 h-3 rounded-full bg-white/8">
              <div
                className="h-3 rounded-full bg-[var(--color-gold)]"
                style={{ width: `${portal.progressPercent}%` }}
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-[var(--color-gold)]/14 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]/76">
                  Tarefas abertas
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--color-gold-soft)]">
                  {portal.openTaskCount}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-[var(--color-gold)]/14 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]/76">
                  Renovacao
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--color-gold-soft)]">
                  {formatDate(portal.account.renewal_date) ?? "Sem data"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] border border-[var(--color-gold)]/20 bg-[var(--color-teal)]/92 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
            Nesta semana
          </p>
          <h2 className="mt-2 font-display text-3xl text-[var(--color-gold-soft)]">
            Materiais da semana {portal.account.week_number}
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {currentWeekMaterials.length === 0 ? (
              <p className="text-sm text-[var(--color-gold-soft)]/72">
                Nenhum material publicado para esta semana ainda.
              </p>
            ) : (
              currentWeekMaterials.map((material) => (
                <a
                  key={material.id}
                  href={material.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[1.5rem] border border-[var(--color-gold)]/16 bg-black/12 p-5 transition hover:bg-black/18"
                >
                  <p className="font-display text-2xl leading-tight text-[var(--color-gold-soft)]">
                    {material.title}
                  </p>
                  {material.description ? (
                    <p className="mt-3 text-sm leading-6 text-[var(--color-gold-soft)]/72">
                      {material.description}
                    </p>
                  ) : null}
                  <p className="mt-5 text-xs uppercase tracking-[0.26em] text-[var(--color-gold)]">
                    Abrir material
                  </p>
                </a>
              ))
            )}
          </div>
        </article>

        <article className="rounded-[2rem] border border-[var(--color-gold)]/28 bg-[var(--color-gold)] p-6 text-[var(--color-night)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
            Proximo passo
          </p>
          <h2 className="mt-2 font-display text-3xl">Leitura rapida</h2>

          <div className="mt-6 space-y-3">
            <div className="rounded-[1.35rem] border border-black/8 bg-[var(--color-gold-soft)] px-4 py-3">
              <p className="text-sm text-black/58">Fase atual</p>
              <p className="mt-1 text-2xl font-semibold">{portal.phase}</p>
            </div>
            <div className="rounded-[1.35rem] border border-black/8 bg-[var(--color-gold-soft)] px-4 py-3">
              <p className="text-sm text-black/58">Contato</p>
              <p className="mt-1 text-lg font-semibold">
                {portal.account.contact_whatsapp ||
                  portal.account.student_email ||
                  "A equipe te orienta por aqui"}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-black/8 bg-[var(--color-gold-soft)] px-4 py-3">
              <p className="text-sm text-black/58">Tarefas agora</p>
              <p className="mt-1 text-2xl font-semibold">{openTasks.length}</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
