import Link from "next/link";
import { requireStudentSession } from "@/lib/auth";
import { getStudentPortalData } from "@/lib/student-portal-data";

const memberCards = [
  {
    title: "Candeeiro",
    href: "/portal/programa/candeeiro",
    image: "/portal-candeeiro-card.png",
    description: "Progresso, trilha e materiais do programa.",
    kind: "candeeiro",
  },
  {
    title: "Vigília",
    href: "/portal/programa/vigilia",
    image: "/portal-vigilia-card.png",
    description: "Acompanhe sua jornada e o conteúdo liberado.",
    kind: "vigilia",
  },
  {
    title: "Clientes",
    href: "/portal/clientes",
    image: "/portal-clientes-card.png",
    description: "Cadastre clientes, leads, prontuários e anotações.",
  },
  {
    title: "Suporte",
    href: "/portal/suporte",
    image: "/portal-suporte-card.png",
    description: "Abra sua conversa com o professor e acompanhe o histórico.",
  },
] as const;

export default async function PortalPage() {
  const { user, profile } = await requireStudentSession("/portal");
  const portal = await getStudentPortalData({
    profileId: profile.id,
    email: user.email,
  });

  const activeProgram = portal.account?.program_kind ?? null;
  const spotlightCard =
    memberCards.find((card) => "kind" in card && card.kind === activeProgram) ??
    memberCards[0];

  if (!portal.account) {
    return (
      <div className="space-y-8">
        <section className="relative overflow-hidden border border-[var(--color-gold)]/18 bg-[linear-gradient(135deg,#060a0d_0%,#111d26_50%,#0a1218_100%)] shadow-[var(--shadow-panel)]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('/portal-candeeiro-card.png')" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,6,8,0.92),rgba(4,6,8,0.48),rgba(4,6,8,0.75))]" />
          <div className="relative px-6 py-10 lg:px-8 lg:py-14">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-gold)]">
              Área de membros
            </p>
            <h2 className="mt-4 max-w-[10ch] font-display text-5xl leading-none text-[var(--color-paper)] sm:text-6xl">
              Seu catálogo já está pronto.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-paper)]/72">
              Ainda não encontramos uma matrícula vinculada a este acesso. Assim
              que a equipe conectar seu e-mail, seus programas e módulos ficarão
              disponíveis aqui.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]/76">
                Biblioteca
              </p>
              <h3 className="mt-2 font-display text-3xl text-[var(--color-gold-soft)]">
                Acesso do aluno
              </h3>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {memberCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group block aspect-square overflow-hidden border border-[var(--color-gold)]/12 bg-[var(--color-night)]"
              >
                <div
                  className="flex h-full items-end bg-cover bg-center transition duration-300 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(5,8,10,0.08), rgba(5,8,10,0.84)), url('${card.image}')` }}
                >
                  <div className="w-full p-4">
                    <p className="font-display text-3xl text-[var(--color-paper)]">
                      {card.title}
                    </p>
                    <p className="mt-2 max-w-[24ch] text-sm leading-6 text-[var(--color-paper)]/72">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden border border-[var(--color-gold)]/18 bg-[linear-gradient(135deg,#05080b_0%,#0e1820_40%,#070c10_100%)] shadow-[var(--shadow-panel)]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-34"
          style={{ backgroundImage: `url('${spotlightCard.image}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,5,8,0.96),rgba(4,5,8,0.68),rgba(4,5,8,0.88))]" />

        <div className="relative grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-12">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-gold)]">
              Área de membros
            </p>
            <h2 className="mt-4 max-w-[9ch] font-display text-5xl leading-none text-[var(--color-paper)] sm:text-6xl">
              Continue sua jornada.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-paper)]/72">
              {profile.full_name}, seu acesso ativo está organizado como uma
              vitrine de programas e módulos. Entre no programa atual ou siga para
              clientes e suporte.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-[var(--color-paper)]/74">
              <span className="border border-[var(--color-gold)]/18 bg-black/16 px-4 py-2">
                Programa ativo: {portal.account.program_name}
              </span>
              <span className="border border-[var(--color-gold)]/18 bg-black/16 px-4 py-2">
                Semana {portal.account.week_number} de {portal.account.duration_weeks}
              </span>
              <span className="border border-[var(--color-gold)]/18 bg-black/16 px-4 py-2">
                {portal.phase}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/portal/programa/${portal.account.program_kind}`}
                className="inline-flex h-11 items-center justify-center border border-[var(--color-gold)] bg-[var(--color-gold)] px-5 text-sm font-semibold text-[var(--color-night)] transition hover:bg-[var(--color-gold-soft)]"
              >
                Abrir programa
              </Link>
              <Link
                href="/portal/suporte"
                className="inline-flex h-11 items-center justify-center border border-[var(--color-gold)]/18 bg-black/14 px-5 text-sm text-[var(--color-paper)] transition hover:bg-black/24"
              >
                Ir para suporte
              </Link>
            </div>
          </div>

          <div className="grid gap-px border border-[var(--color-gold)]/12 bg-[var(--color-gold)]/12 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <article className="bg-[rgba(3,8,12,0.72)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]/74">
                Progresso
              </p>
              <p className="mt-3 font-display text-5xl text-[var(--color-paper)]">
                {portal.progressPercent}%
              </p>
            </article>
            <article className="bg-[rgba(3,8,12,0.72)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]/74">
                Tarefas abertas
              </p>
              <p className="mt-3 font-display text-5xl text-[var(--color-paper)]">
                {portal.openTaskCount}
              </p>
            </article>
            <article className="bg-[rgba(3,8,12,0.72)] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]/74">
                Status
              </p>
              <p className="mt-3 font-display text-4xl text-[var(--color-paper)]">
                {portal.account.status}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]/76">
              Catálogo
            </p>
            <h3 className="mt-2 font-display text-3xl text-[var(--color-gold-soft)]">
              Área de membros
            </h3>
          </div>
          <p className="max-w-xl text-right text-sm leading-6 text-[var(--color-paper)]/56">
            Cards quadrados, acesso direto por programa e módulos permanentes de
            operação.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {memberCards.map((card) => {
            const isCurrentProgram =
              "kind" in card ? card.kind === portal.account.program_kind : false;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="group block aspect-square overflow-hidden border border-white/10 bg-black"
              >
                <div
                  className="flex h-full items-end bg-cover bg-center transition duration-300 group-hover:scale-[1.04]"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(3,5,8,0.04), rgba(3,5,8,0.84)), url('${card.image}')` }}
                >
                  <div className="w-full bg-[linear-gradient(180deg,rgba(4,6,8,0),rgba(4,6,8,0.96))] p-4">
                    {isCurrentProgram ? (
                      <span className="inline-flex border border-[var(--color-gold)]/18 bg-[var(--color-gold)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-night)]">
                        Em andamento
                      </span>
                    ) : null}
                    <p className="mt-3 font-display text-3xl text-[var(--color-paper)]">
                      {card.title}
                    </p>
                    <p className="mt-2 max-w-[24ch] text-sm leading-6 text-[var(--color-paper)]/70">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
