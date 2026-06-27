import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudentSession } from "@/lib/auth";
import { getStudentPortalData } from "@/lib/student-portal-data";

const programMap = {
  candeeiro: {
    title: "Candeeiro",
    image: "/portal-candeeiro-card.png",
    description:
      "Seu andamento, materiais liberados e os próximos passos do programa Candeeiro.",
  },
  vigilia: {
    title: "Vigília",
    image: "/portal-vigilia-card.png",
    description:
      "Acesso ao progresso, à trilha e aos materiais do programa Vigília.",
  },
} as const;

type ProgramSlug = keyof typeof programMap;

function formatDate(date: string | null) {
  if (!date) return "Sem data";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
  }).format(new Date(date));
}

export default async function PortalProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!(slug in programMap)) {
    notFound();
  }

  const program = programMap[slug as ProgramSlug];
  const { user, profile } = await requireStudentSession(`/portal/programa/${slug}`);
  const portal = await getStudentPortalData({
    profileId: profile.id,
    email: user.email,
  });

  const isCurrentProgram = portal.account?.program_kind === slug;
  const currentWeekMaterials = isCurrentProgram
    ? portal.materials.filter(
        (material) => material.week_number === portal.account?.week_number,
      )
    : [];
  const openTasks = isCurrentProgram
    ? portal.tasks.filter((task) => task.status !== "done")
    : [];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden border border-[var(--color-gold)]/18 bg-[#091117] shadow-[var(--shadow-panel)]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('${program.image}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,10,0.96),rgba(6,8,10,0.62),rgba(6,8,10,0.88))]" />

        <div className="relative grid gap-8 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
              Programa
            </p>
            <h2 className="mt-3 font-display text-5xl leading-none text-[var(--color-paper)] sm:text-6xl">
              {program.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-paper)]/72">
              {program.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/portal"
                className="inline-flex h-11 items-center justify-center border border-[var(--color-gold)]/18 bg-black/18 px-5 text-sm text-[var(--color-paper)] transition hover:bg-black/28"
              >
                Voltar para catálogo
              </Link>
              <Link
                href="/portal/materiais"
                className="inline-flex h-11 items-center justify-center border border-[var(--color-gold)] bg-[var(--color-gold)] px-5 text-sm font-semibold text-[var(--color-night)] transition hover:bg-[var(--color-gold-soft)]"
              >
                Ver biblioteca completa
              </Link>
            </div>
          </div>

          <div className="grid gap-px border border-[var(--color-gold)]/12 bg-[var(--color-gold)]/12 sm:grid-cols-2 xl:grid-cols-2">
            <article className="bg-[rgba(3,8,12,0.76)] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]/76">
                Acesso
              </p>
              <p className="mt-3 font-display text-4xl text-[var(--color-paper)]">
                {isCurrentProgram ? "Ativo" : "Indisponível"}
              </p>
            </article>
            <article className="bg-[rgba(3,8,12,0.76)] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]/76">
                Progresso
              </p>
              <p className="mt-3 font-display text-4xl text-[var(--color-paper)]">
                {isCurrentProgram ? `${portal.progressPercent}%` : "--"}
              </p>
            </article>
            <article className="bg-[rgba(3,8,12,0.76)] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]/76">
                Semana
              </p>
              <p className="mt-3 font-display text-4xl text-[var(--color-paper)]">
                {isCurrentProgram && portal.account
                  ? `${portal.account.week_number}/${portal.account.duration_weeks}`
                  : "--"}
              </p>
            </article>
            <article className="bg-[rgba(3,8,12,0.76)] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]/76">
                Renovação
              </p>
              <p className="mt-3 font-display text-3xl text-[var(--color-paper)]">
                {isCurrentProgram && portal.account
                  ? formatDate(portal.account.renewal_date)
                  : "--"}
              </p>
            </article>
          </div>
        </div>
      </section>

      {!portal.account ? (
        <section className="border border-[var(--color-gold)]/16 bg-[var(--color-teal)]/92 p-6">
          <h3 className="font-display text-3xl text-[var(--color-gold-soft)]">
            Matrícula pendente
          </h3>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-gold-soft)]/72">
            Ainda não encontramos uma matrícula vinculada a este acesso. Assim que a
            equipe conectar seu e-mail, o programa exibirá progresso, materiais e
            tarefas.
          </p>
        </section>
      ) : !isCurrentProgram ? (
        <section className="border border-[var(--color-gold)]/16 bg-[var(--color-teal)]/92 p-6">
          <h3 className="font-display text-3xl text-[var(--color-gold-soft)]">
            Programa não vinculado
          </h3>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-gold-soft)]/72">
            Seu acesso atual está vinculado ao programa{" "}
            <strong>{portal.account.program_name}</strong>. Quando a matrícula de{" "}
            {program.title} estiver ativa, este espaço passa a mostrar sua trilha
            específica.
          </p>
        </section>
      ) : (
        <>
          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="border border-[var(--color-gold)]/16 bg-[var(--color-teal)]/92 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
                Progresso
              </p>
              <h3 className="mt-2 font-display text-4xl text-[var(--color-gold-soft)]">
                Sua etapa atual
              </h3>

              <div className="mt-6 grid gap-px border border-[var(--color-gold)]/12 bg-[var(--color-gold)]/12 sm:grid-cols-3">
                <div className="bg-black/14 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]/74">
                    Fase
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-[var(--color-gold-soft)]">
                    {portal.phase}
                  </p>
                </div>
                <div className="bg-black/14 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]/74">
                    Tarefas abertas
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-[var(--color-gold-soft)]">
                    {openTasks.length}
                  </p>
                </div>
                <div className="bg-black/14 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]/74">
                    Contato
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[var(--color-gold-soft)]">
                    {portal.account.contact_whatsapp ||
                      portal.account.student_email ||
                      "A equipe te orienta por aqui"}
                  </p>
                </div>
              </div>
            </article>

            <article className="border border-[var(--color-gold)]/16 bg-[var(--color-gold)] p-6 text-[var(--color-night)]">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
                Leitura rápida
              </p>
              <h3 className="mt-2 font-display text-4xl">Trilha em andamento</h3>
              <p className="mt-5 text-sm leading-7 text-black/66">
                Seu progresso está na semana {portal.account.week_number} de{" "}
                {portal.account.duration_weeks}. Use a biblioteca abaixo para abrir
                os materiais desta etapa e siga para tarefas quando precisar revisar
                suas entregas.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/portal/tarefas"
                  className="inline-flex h-10 items-center justify-center border border-black/10 bg-[var(--color-gold-soft)] px-4 text-sm font-medium text-[var(--color-night)] transition hover:bg-white"
                >
                  Abrir tarefas
                </Link>
                <Link
                  href="/portal/suporte"
                  className="inline-flex h-10 items-center justify-center border border-black/10 bg-transparent px-4 text-sm text-[var(--color-night)] transition hover:bg-black/5"
                >
                  Falar com suporte
                </Link>
              </div>
            </article>
          </section>

          <section className="border border-[var(--color-gold)]/16 bg-[var(--color-teal)]/92 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
              Biblioteca
            </p>
            <h3 className="mt-2 font-display text-4xl text-[var(--color-gold-soft)]">
              Materiais da semana {portal.account.week_number}
            </h3>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {currentWeekMaterials.length === 0 ? (
                <p className="text-sm leading-7 text-[var(--color-gold-soft)]/72">
                  Nenhum material foi publicado para esta semana ainda.
                </p>
              ) : (
                currentWeekMaterials.map((material) => (
                  <a
                    key={material.id}
                    href={material.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-[var(--color-gold)]/14 bg-black/12 p-5 transition hover:bg-black/18"
                  >
                    <p className="font-display text-2xl leading-tight text-[var(--color-gold-soft)]">
                      {material.title}
                    </p>
                    {material.description ? (
                      <p className="mt-3 text-sm leading-6 text-[var(--color-gold-soft)]/72">
                        {material.description}
                      </p>
                    ) : null}
                    <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                      Abrir material
                    </p>
                  </a>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
