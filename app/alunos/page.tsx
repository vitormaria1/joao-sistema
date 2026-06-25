import { SiteShell } from "@/app/_components/site-shell";
import {
  createAttachment,
  createStudentAccount,
  updateStudentProgress,
} from "@/app/dashboard/actions";
import { getCurrentProfile } from "@/lib/auth";
import { getAttachments, getPrograms, getStudents } from "@/lib/dashboard-data";

export default async function AlunosPage() {
  const profile = await getCurrentProfile();
  const [programs, students, attachments] = await Promise.all([
    getPrograms(),
    getStudents(),
    getAttachments(),
  ]);

  const attachmentsByStudent = attachments.filter(
    (item) => item.entity_type === "student",
  );

  const studentMetrics = [
    { label: "Alunos", value: students.length },
    {
      label: "Ativos",
      value: students.filter((student) => student.status === "active").length,
    },
    {
      label: "Pausados",
      value: students.filter((student) => student.status === "paused").length,
    },
    { label: "Materiais", value: attachmentsByStudent.length },
  ];

  return (
    <SiteShell
      title="Alunos"
      subtitle={`${profile.full_name} · andamento e materiais.`}
      accent="light"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {studentMetrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.75rem] border border-black/8 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)]"
          >
            <p className="text-sm text-black/55">{metric.label}</p>
            <p className="mt-4 font-display text-5xl text-[var(--color-teal)]">
              {String(metric.value).padStart(2, "0")}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-[2rem] border border-black/8 bg-[#f3ede2] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
            Nova matrícula
          </p>
          <h2 className="mt-2 font-display text-3xl">Cadastro rápido</h2>

          <details className="mt-6 rounded-[1.5rem] border border-black/8 bg-white px-4 py-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-[var(--color-ink)]">
              Abrir formulário
            </summary>

            <form action={createStudentAccount} className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                name="studentName"
                placeholder="Nome do aluno"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
                required
              />
              <input
                name="studentEmail"
                placeholder="E-mail"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
              />
              <input
                name="contactWhatsapp"
                placeholder="WhatsApp"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
              />
              <select
                name="programId"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Programa
                </option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
              <select
                name="status"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
                defaultValue="active"
              >
                <option value="active">Ativo</option>
                <option value="paused">Pausado</option>
                <option value="finished">Finalizado</option>
              </select>
              <input
                name="weekNumber"
                type="number"
                min="1"
                max="6"
                defaultValue="1"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
              />
              <input
                name="startedAt"
                type="date"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
              />
              <input
                name="renewalDate"
                type="date"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
              />
              <textarea
                name="notes"
                placeholder="Notas"
                className="min-h-28 rounded-2xl border border-black/10 bg-white px-4 py-3 md:col-span-2"
              />
              <button
                type="submit"
                className="md:col-span-2 inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-ink)] px-6 text-sm font-semibold text-[var(--color-paper)]"
              >
                Salvar aluno
              </button>
            </form>
          </details>
        </article>

        <article className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
            Carteira
          </p>
          <h2 className="mt-2 font-display text-3xl">Andamento atual</h2>

          <div className="mt-6 space-y-4">
            {students.length === 0 ? (
              <p className="text-sm text-black/60">Nenhum aluno cadastrado.</p>
            ) : (
              students.map((student) => {
                const progress = Math.min(
                  100,
                  Math.round((student.week_number / student.duration_weeks) * 100),
                );
                const studentAttachments = attachmentsByStudent
                  .filter((item) => item.entity_id === student.id)
                  .slice(0, 2);

                return (
                  <article
                    key={student.id}
                    className="rounded-[1.5rem] border border-black/8 bg-[#f8f5ef] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{student.student_name}</p>
                        <p className="text-sm text-black/55">
                          {student.program_name} · {student.status}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--color-teal)]/10 px-3 py-1 text-xs text-[var(--color-teal)]">
                        {progress}%
                      </span>
                    </div>

                    <div className="mt-4 h-2 rounded-full bg-black/5">
                      <div
                        className="h-2 rounded-full bg-[var(--color-teal)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-black/55">
                      <span className="rounded-full bg-white px-2 py-1">
                        Semana {student.week_number}/{student.duration_weeks}
                      </span>
                      {student.contact_whatsapp ? (
                        <span className="rounded-full bg-white px-2 py-1">
                          {student.contact_whatsapp}
                        </span>
                      ) : null}
                      {student.renewal_date ? (
                        <span className="rounded-full bg-white px-2 py-1">
                          Renovação {student.renewal_date}
                        </span>
                      ) : null}
                    </div>

                    {student.notes ? (
                      <p className="mt-3 text-sm text-black/65">{student.notes}</p>
                    ) : null}

                    <div className="mt-4 space-y-2">
                      {studentAttachments.map((item) => (
                        <a
                          key={item.id}
                          href={item.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-xl border border-black/8 bg-white px-3 py-2 text-sm"
                        >
                          {item.title} · {item.kind}
                        </a>
                      ))}
                    </div>

                    <details className="mt-4 rounded-[1.25rem] border border-black/8 bg-white px-4 py-3">
                      <summary className="cursor-pointer list-none text-sm font-medium text-[var(--color-ink)]">
                        Atualizar progresso
                      </summary>

                      <form
                        action={updateStudentProgress}
                        className="mt-3 grid gap-3 md:grid-cols-3"
                      >
                        <input
                          type="hidden"
                          name="studentAccountId"
                          value={student.id}
                        />
                        <select
                          name="status"
                          defaultValue={student.status}
                          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm"
                        >
                          <option value="active">Ativo</option>
                          <option value="paused">Pausado</option>
                          <option value="finished">Finalizado</option>
                        </select>
                        <input
                          name="weekNumber"
                          type="number"
                          min="1"
                          max="6"
                          defaultValue={student.week_number}
                          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm"
                        />
                        <input
                          name="notes"
                          placeholder="Nova nota"
                          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm"
                        />
                        <button
                          type="submit"
                          className="md:col-span-3 inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-ink)] px-5 text-sm text-[var(--color-paper)]"
                        >
                          Atualizar progresso
                        </button>
                      </form>
                    </details>

                    <details className="mt-3 rounded-[1.25rem] border border-black/8 bg-white px-4 py-3">
                      <summary className="cursor-pointer list-none text-sm font-medium text-[var(--color-ink)]">
                        Adicionar material
                      </summary>

                      <form action={createAttachment} className="mt-3 grid gap-2 md:grid-cols-2">
                        <input type="hidden" name="entityType" value="student" />
                        <input type="hidden" name="entityId" value={student.id} />
                        <input
                          name="title"
                          placeholder="Título do material"
                          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm"
                        />
                        <input
                          name="fileUrl"
                          placeholder="URL do arquivo"
                          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm"
                        />
                        <select
                          name="kind"
                          defaultValue="material"
                          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm"
                        >
                          <option value="material">Material</option>
                          <option value="attachment">Anexo</option>
                        </select>
                        <button
                          type="submit"
                          className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-4 text-sm"
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
        </article>
      </section>
    </SiteShell>
  );
}
