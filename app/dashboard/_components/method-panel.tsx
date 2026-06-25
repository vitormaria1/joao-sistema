"use client";

import { useState } from "react";

const sections = [
  {
    id: "metodo",
    label: "Método",
    eyebrow: "Centro do sistema",
    title: "O método organiza toda a operação.",
    body:
      "O dashboard não é uma vitrine de métricas soltas. Ele existe para mostrar a cadência do método, o avanço do aluno e o material que João entrega em cada etapa.",
    bullets: [
      "Uma trilha única guia a jornada do aluno do início ao fechamento.",
      "O sistema mantém a operação alinhada ao método, não ao improviso.",
      "Cada etapa pode ser acompanhada e atualizada sem sair do fluxo.",
    ],
  },
  {
    id: "evolucao",
    label: "Evolução",
    eyebrow: "Acompanhamento do aluno",
    title: "O aluno enxerga seu progresso de forma simples.",
    body:
      "A área do aluno mostra semana atual, avanço acumulado, renovação e anotações. Isso reduz dúvidas e facilita a continuidade do processo.",
    bullets: [
      "Semanas de progresso organizadas do 1 ao 6.",
      "Notas e status ficam visíveis na carteira de alunos.",
      "O avanço pode ser atualizado sem complicação para o time.",
    ],
  },
  {
    id: "materiais",
    label: "Materiais",
    eyebrow: "Entrega operacional",
    title: "João anexa os materiais diretamente na rotina.",
    body:
      "Arquivos, referências e anexos ficam ligados ao aluno ou à tarefa. Isso deixa a entrega rastreável e evita conteúdo espalhado em conversas.",
    bullets: [
      "Materiais podem ser anexados por aluno ou por tarefa.",
      "Os documentos ficam reunidos no contexto correto.",
      "A equipe acessa o que precisa sem procurar fora do sistema.",
    ],
  },
] as const;

export function MethodPanel() {
  const [activeSection, setActiveSection] =
    useState<(typeof sections)[number]["id"]>("metodo");

  const currentSection = sections.find((section) => section.id === activeSection) ?? sections[0];

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-[1.6rem] border border-white/10 bg-black/10 p-3">
          <p className="px-3 pb-3 text-xs uppercase tracking-[0.3em] text-white/45">
            Método
          </p>
          <div className="grid gap-2">
            {sections.map((section) => {
              const active = section.id === activeSection;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={
                    active
                      ? "rounded-2xl bg-[var(--color-gold)] px-3 py-3 text-left text-sm font-medium text-[var(--color-ink)]"
                      : "rounded-2xl border border-white/10 px-3 py-3 text-left text-sm text-white/72 transition hover:bg-white/5"
                  }
                >
                  <span className="block text-[11px] uppercase tracking-[0.2em] opacity-70">
                    {section.eyebrow}
                  </span>
                  <span className="mt-1 block">{section.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="rounded-[1.6rem] border border-white/10 bg-black/10 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
            {currentSection.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl">{currentSection.title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
            {currentSection.body}
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {currentSection.bullets.map((bullet) => (
              <div
                key={bullet}
                className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/72"
              >
                {bullet}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
