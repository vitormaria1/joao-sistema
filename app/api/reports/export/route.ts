import PDFDocument from "pdfkit";
import { getReportData } from "@/lib/dashboard-data";

export const runtime = "nodejs";

function buildPdfBuffer(doc: InstanceType<typeof PDFDocument>) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

export async function GET() {
  const { summary, programs, students, tasks, leads, activities, attachments } =
    await getReportData();

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const pdfPromise = buildPdfBuffer(doc);

  doc.fontSize(20).text("Joao Sistema - Relatorio Operacional");
  doc.moveDown();
  doc.fontSize(12).text(`Alunos ativos: ${summary.activeStudents}`);
  doc.text(`Leads: ${summary.leads}`);
  doc.text(`Tarefas abertas: ${summary.openTasks}`);
  doc.text(`Programas ativos: ${summary.activePrograms}`);
  doc.moveDown();
  doc.fontSize(14).text("Programas");
  programs.slice(0, 6).forEach((program) => {
    doc.fontSize(11).text(`- ${program.name} (${program.kind}, ${program.duration_weeks} semanas)`);
  });
  doc.moveDown();
  doc.fontSize(14).text("Alunos");
  students.slice(0, 10).forEach((student) => {
    doc.fontSize(11).text(`- ${student.student_name} | semana ${student.week_number}/${student.duration_weeks}`);
  });
  doc.moveDown();
  doc.fontSize(14).text("Leads");
  leads.slice(0, 10).forEach((lead) => {
    doc.fontSize(11).text(`- ${lead.name} | ${lead.stage}`);
  });
  doc.moveDown();
  doc.fontSize(14).text("Tarefas");
  tasks.slice(0, 10).forEach((task) => {
    doc.fontSize(11).text(`- ${task.title} | ${task.priority} | ${task.status}`);
  });
  doc.moveDown();
  doc.fontSize(14).text("Interacoes e anexos");
  doc.fontSize(11).text(`Interacoes: ${activities.length}`);
  doc.fontSize(11).text(`Anexos/materiais: ${attachments.length}`);

  doc.end();

  const buffer = await pdfPromise;

  return new Response(buffer as unknown as BodyInit, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": 'attachment; filename="joao-sistema-relatorio.pdf"',
    },
  });
}
