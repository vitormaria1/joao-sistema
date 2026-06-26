import { SiteShell } from "@/app/_components/site-shell";
import { createMethodMaterial } from "@/app/dashboard/actions";
import { requireProfile } from "@/lib/auth";
import { getMethodMaterials } from "@/lib/dashboard-data";
import { weeklyFlow } from "@/lib/platform-data";

export default async function MetodoPage() {
  const profile = await requireProfile("/metodo");
  const materials = await getMethodMaterials();

  return (
    <SiteShell
      title="Método"
      subtitle={`${profile.full_name} · biblioteca do método e materiais.`}
      accent="dark"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] p-5 md:col-span-2">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
            Método
          </p>
        </article>

        <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
            Cadência
          </p>
          <div className="mt-4 space-y-2">
            {weeklyFlow.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-black/10 px-3 py-3">
                <span className="mt-0.5 text-xs font-semibold text-[var(--color-gold)]">
                  {index + 1}
                </span>
                <p className="text-sm text-white/72">{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-[2rem] border border-white/10 bg-[#f3ede2] p-6 text-[var(--color-ink)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
            Novo material
          </p>
          <h2 className="mt-2 font-display text-3xl">Publicar conteúdo</h2>

          <form action={createMethodMaterial} className="mt-6 grid gap-3">
            <input
              name="title"
              placeholder="Título do material"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4"
              required
            />
            <input
              name="fileUrl"
              placeholder="URL do arquivo"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4"
              required
            />
            <select
              name="weekNumber"
              defaultValue="1"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4"
            >
              {weeklyFlow.map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  Semana {index + 1}
                </option>
              ))}
            </select>
            <textarea
              name="description"
              placeholder="Descrição curta"
              className="min-h-28 rounded-2xl border border-black/10 bg-white px-4 py-3"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-ink)] px-6 text-sm font-semibold text-[var(--color-paper)]"
            >
              Salvar material
            </button>
          </form>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
            Biblioteca
          </p>
          <h2 className="mt-2 font-display text-3xl">Materiais publicados</h2>

          <div className="mt-6 space-y-3">
            {materials.length === 0 ? (
              <p className="text-sm text-white/60">Nenhum material publicado ainda.</p>
            ) : (
              materials.map((material) => (
                <article
                  key={material.id}
                  className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium">{material.title}</p>
                      {material.description ? (
                        <p className="mt-1 text-sm text-white/65">
                          {material.description}
                        </p>
                      ) : null}
                    </div>
                    <span className="rounded-full bg-[var(--color-gold)]/15 px-3 py-1 text-xs text-[var(--color-gold)]">
                      Semana {material.week_number}
                    </span>
                  </div>
                  <a
                    href={material.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm text-white underline decoration-white/30 underline-offset-4"
                  >
                    Abrir arquivo
                  </a>
                </article>
              ))
            )}
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
