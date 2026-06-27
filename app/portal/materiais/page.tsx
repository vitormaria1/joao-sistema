import { requireStudentSession } from "@/lib/auth";
import {
  getStudentPortalData,
  type StudentPortalMaterial,
} from "@/lib/student-portal-data";

export default async function PortalMateriaisPage() {
  const { user, profile } = await requireStudentSession("/portal/materiais");
  const portal = await getStudentPortalData({
    profileId: profile.id,
    email: user.email,
  });

  if (!portal.account) {
    return (
      <section className="rounded-[2rem] border border-[var(--color-gold)]/20 bg-[var(--color-teal)]/92 p-6">
        <h2 className="font-display text-3xl text-[var(--color-gold-soft)]">
          Materiais
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--color-gold-soft)]/72">
          Seu acesso ainda nao foi vinculado a uma matricula.
        </p>
      </section>
    );
  }

  const grouped = portal.materials.reduce<Record<number, StudentPortalMaterial[]>>(
    (acc, material) => {
      acc[material.week_number] ??= [];
      acc[material.week_number].push(material);
      return acc;
    },
    {},
  );

  return (
    <section className="space-y-6">
      <header className="rounded-[2rem] border border-[var(--color-gold)]/20 bg-[var(--color-teal)]/92 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
          Biblioteca
        </p>
        <h2 className="mt-2 font-display text-4xl text-[var(--color-gold-soft)]">
          Materiais do programa
        </h2>
      </header>

      {Object.entries(grouped).map(([week, items]) => (
        <section
          key={week}
          className="rounded-[2rem] border border-[var(--color-gold)]/20 bg-[var(--color-teal)]/92 p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display text-3xl text-[var(--color-gold-soft)]">
              Semana {week}
            </h3>
            {Number(week) === portal.account?.week_number ? (
              <span className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--color-night)]">
                Atual
              </span>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((material) => (
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
              </a>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
