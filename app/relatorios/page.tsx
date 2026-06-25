import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { getReportData } from "@/lib/dashboard-data";

export default async function RelatoriosPage() {
  const profile = await getCurrentProfile();
  const { summary, programs, students, tasks, leads, activities, attachments } =
    await getReportData();

  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.06)] sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-teal)]">
              Relatórios
            </p>
            <h1 className="mt-2 font-display text-4xl">Indicadores e exportação</h1>
            <p className="mt-3 text-sm text-black/60">
              {profile.full_name} · resumo operacional para análise e PDF.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/api/reports/export"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-ink)] px-5 text-sm text-[var(--color-paper)]"
            >
              Exportar PDF
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Programas", value: programs.length },
            { label: "Alunos ativos", value: summary.activeStudents },
            { label: "Leads", value: summary.leads },
            { label: "Tarefas abertas", value: summary.openTasks },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-[1.75rem] border border-black/8 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)]"
            >
              <p className="text-sm text-black/55">{item.label}</p>
              <p className="mt-4 font-display text-5xl text-[var(--color-teal)]">
                {String(item.value).padStart(2, "0")}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
              Progresso
            </p>
            <h2 className="mt-2 font-display text-3xl">Alunos e tarefas</h2>
            <div className="mt-6 space-y-3 text-sm">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between rounded-2xl bg-black/5 px-4 py-3">
                  <span>{student.student_name}</span>
                  <span className="text-black/55">
                    semana {student.week_number}/{student.duration_weeks}
                  </span>
                </div>
              ))}
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-2xl bg-black/5 px-4 py-3">
                  <span>{task.title}</span>
                  <span className="text-black/55">{task.priority}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-black/8 bg-[#f3ede2] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
              Cobertura
            </p>
            <h2 className="mt-2 font-display text-3xl">Conteúdo do relatório</h2>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="rounded-2xl bg-white px-4 py-3">Programas ativos: {programs.length}</div>
              <div className="rounded-2xl bg-white px-4 py-3">Alunos: {students.length}</div>
              <div className="rounded-2xl bg-white px-4 py-3">Leads: {leads.length}</div>
              <div className="rounded-2xl bg-white px-4 py-3">Interações: {activities.length}</div>
              <div className="rounded-2xl bg-white px-4 py-3">Anexos/materiais: {attachments.length}</div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
