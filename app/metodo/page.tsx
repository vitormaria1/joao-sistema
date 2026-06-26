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
        <article className="rounded-md border border-[#c4b27b]/24 bg-[#0f5d73] p-5 md:col-span-2">
          <p className="text-xs uppercase tracking-[0.3em] text-[#cfbc79]">
            Método
          </p>
        </article>

        <article className="rounded-md border border-[#c4b27b]/24 bg-[#0f5d73] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[#cfbc79]">
            Cadência
          </p>
          <div className="mt-4 space-y-2">
            {weeklyFlow.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-sm border border-white/10 bg-black/12 px-3 py-3">
                <span className="mt-0.5 text-xs font-semibold text-[#cfbc79]">
                  {index + 1}
                </span>
                <p className="text-sm text-[#efe2b3]/78">{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-md border border-[#cfbc79]/35 bg-[#cfbc79] p-6 text-[#153d4c]">
          <p className="text-xs uppercase tracking-[0.3em] text-[#045973]">
            Novo material
          </p>
          <h2 className="mt-2 font-display text-3xl">Publicar conteúdo</h2>

          <form action={createMethodMaterial} className="mt-6 grid gap-3">
            <input
              name="title"
              placeholder="Título do material"
              className="h-12 rounded-md border border-[#b89e5a]/26 bg-[#efe2b3] px-4"
              required
            />
            <input
              name="fileUrl"
              placeholder="URL do arquivo"
              className="h-12 rounded-md border border-[#b89e5a]/26 bg-[#efe2b3] px-4"
              required
            />
            <select
              name="weekNumber"
              defaultValue="1"
              className="h-12 rounded-md border border-[#b89e5a]/26 bg-[#efe2b3] px-4"
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
              className="min-h-28 rounded-md border border-[#b89e5a]/26 bg-[#efe2b3] px-4 py-3"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-sm bg-[#045973] px-6 text-sm font-semibold text-[#efe2b3]"
            >
              Salvar material
            </button>
          </form>
        </article>

        <article className="rounded-md border border-[#c4b27b]/24 bg-[#0f5d73] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#cfbc79]">
            Biblioteca
          </p>
          <h2 className="mt-2 font-display text-3xl text-[#f0e2b0]">Materiais publicados</h2>

          <div className="mt-6 space-y-3">
            {materials.length === 0 ? (
              <p className="text-sm text-[#efe2b3]/72">Nenhum material publicado ainda.</p>
            ) : (
              materials.map((material) => (
                <article
                  key={material.id}
                  className="rounded-md border border-white/10 bg-black/12 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium text-[#f6ebc5]">{material.title}</p>
                      {material.description ? (
                        <p className="mt-1 text-sm text-[#efe2b3]/72">
                          {material.description}
                        </p>
                      ) : null}
                    </div>
                    <span className="rounded-sm bg-[#cfbc79]/16 px-3 py-1 text-xs text-[#f0e2b0]">
                      Semana {material.week_number}
                    </span>
                  </div>
                  <a
                    href={material.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm text-[#f6ebc5] underline decoration-[#f6ebc5]/30 underline-offset-4"
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
