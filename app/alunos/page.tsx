import Link from "next/link";
import { createAttachment } from "@/app/dashboard/actions";
import {
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

  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.06)] sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-teal)]">
              Alunos
            </p>
            <h1 className="mt-2 font-display text-4xl">Matrículas e progresso</h1>
            <p className="mt-3 text-sm text-black/60">
              {profile.full_name} · cadastro de alunos e avanço por semana.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/tarefas"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-ink)] px-5 text-sm text-[var(--color-paper)]"
            >
              Tarefas
            </Link>
          </nav>
        </header>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.06)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
              Nova matrícula
            </p>
            <h2 className="mt-2 font-display text-3xl">Cadastrar aluno</h2>

            <form action={createStudentAccount} className="mt-6 grid gap-3 md:grid-cols-2">
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
          </article>

          <article className="rounded-[2rem] border border-black/8 bg-[#f3ede2] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
              Progresso
            </p>
            <h2 className="mt-2 font-display text-3xl">Matrículas registradas</h2>
            <div className="mt-6 space-y-4">
              {students.length === 0 ? (
                <p className="text-sm text-black/60">Nenhum aluno cadastrado.</p>
              ) : (
                students.map((student) => {
                  const progress = Math.min(
                    100,
                    Math.round((student.week_number / student.duration_weeks) * 100),
                  );

                  return (
                    <div
                      key={student.id}
                      className="rounded-[1.5rem] border border-black/8 bg-white px-4 py-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold">{student.student_name}</p>
                          <p className="text-sm text-black/55">
                            {student.program_name} · {student.status}
                          </p>
                          <p className="mt-1 text-sm text-black/55">
                            Semana {student.week_number} de {student.duration_weeks}
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

                        <div className="mt-4 space-y-2">
                          {attachmentsByStudent
                            .filter((item) => item.entity_id === student.id)
                            .slice(0, 3)
                            .map((item) => (
                              <a
                                key={item.id}
                                href={item.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-xl border border-black/8 bg-black/5 px-3 py-2 text-sm"
                              >
                                {item.title} · {item.kind}
                              </a>
                            ))}
                        </div>

                        <form action={updateStudentProgress} className="mt-4 grid gap-3 md:grid-cols-3">
                        <input type="hidden" name="studentAccountId" value={student.id} />
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

                        <form action={createAttachment} className="mt-4 grid gap-2 md:grid-cols-2">
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
                            Adicionar anexo
                          </button>
                        </form>
                      </div>
                    );
                  })
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
