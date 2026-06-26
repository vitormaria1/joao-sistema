import Link from "next/link";
import { SiteShell } from "@/app/_components/site-shell";
import { requireProfile } from "@/lib/auth";
import { getReportData } from "@/lib/dashboard-data";

export default async function RelatoriosPage() {
  const profile = await requireProfile("/relatorios");
  const { summary, programs, students, tasks, leads, activities, attachments } = await getReportData();

  return (
    <SiteShell
      title="Relatórios"
      subtitle={`${profile.full_name} · indicadores e exportação.`}
      accent="dark"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Programas", value: programs.length },
          { label: "Alunos ativos", value: summary.activeStudents },
          { label: "Leads", value: summary.leads },
          { label: "Tarefas abertas", value: summary.openTasks },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-md border border-[#c4b27b]/24 bg-[#0f5d73] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
          >
            <p className="text-sm text-[#efe2b3]/72">{item.label}</p>
            <p className="mt-4 font-display text-5xl text-[#cfbc79]">
              {String(item.value).padStart(2, "0")}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-md border border-[#c4b27b]/24 bg-[#0f5d73] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[#cfbc79]">
            Visão
          </p>
          <h2 className="mt-2 font-display text-3xl text-[#f0e2b0]">
            Alunos e tarefas
          </h2>
          <div className="mt-6 space-y-3 text-sm">
            {students.slice(0, 5).map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-md border border-white/10 bg-black/12 px-4 py-3"
              >
                <span className="text-[#f6ebc5]">{student.student_name}</span>
                <span className="text-[#efe2b3]/62">
                  semana {student.week_number}/{student.duration_weeks}
                </span>
              </div>
            ))}
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-md border border-white/10 bg-black/12 px-4 py-3"
              >
                <span className="text-[#f6ebc5]">{task.title}</span>
                <span className="text-[#efe2b3]/62">{task.priority}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-[#c4b27b]/24 bg-[#0f5d73] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#cfbc79]">
            Exportação
          </p>
          <h2 className="mt-2 font-display text-3xl text-[#f0e2b0]">
            Conteúdo consolidado
          </h2>
          <div className="mt-6 grid gap-3 text-sm">
            <div className="rounded-md border border-white/10 bg-black/12 px-4 py-3 text-[#f6ebc5]">
              Programas ativos: {programs.length}
            </div>
            <div className="rounded-md border border-white/10 bg-black/12 px-4 py-3 text-[#f6ebc5]">
              Alunos: {students.length}
            </div>
            <div className="rounded-md border border-white/10 bg-black/12 px-4 py-3 text-[#f6ebc5]">
              Leads: {leads.length}
            </div>
            <div className="rounded-md border border-white/10 bg-black/12 px-4 py-3 text-[#f6ebc5]">
              Interações: {activities.length}
            </div>
            <div className="rounded-md border border-white/10 bg-black/12 px-4 py-3 text-[#f6ebc5]">
              Anexos/materiais: {attachments.length}
            </div>
          </div>

          <Link
            href="/api/reports/export"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-sm bg-[#cfbc79] px-6 text-sm font-semibold text-[#153d4c]"
          >
            Baixar PDF
          </Link>
        </article>
      </section>
    </SiteShell>
  );
}
