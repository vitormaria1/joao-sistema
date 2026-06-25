export type ChecklistItem = {
  label: string;
  done: boolean;
};

export type ChecklistSection = {
  title: string;
  items: ChecklistItem[];
};

export const checklistSections: ChecklistSection[] = [
  {
    title: "Fase 1: Fundação",
    items: [
      { label: "Briefing e marca lidos", done: true },
      { label: "Aplicação Next.js criada", done: true },
      { label: "Visual inicial alinhado à marca", done: true },
      { label: "Supabase SSR preparado", done: true },
      { label: "Modelo de dados inicial rascunhado", done: true },
      { label: "DATABASE_URL real configurada", done: true },
      { label: "URL pública do Supabase configurada", done: true },
      { label: "Publishable key configurada", done: true },
    ],
  },
  {
    title: "Fase 2: Núcleo",
    items: [
      { label: "Autenticação real", done: false },
      { label: "Dashboard admin", done: true },
      { label: "Área do aluno", done: true },
      { label: "CRM comercial", done: true },
      { label: "Gestão de tarefas", done: true },
      { label: "Progresso das 6 semanas", done: true },
    ],
  },
];
