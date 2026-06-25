"use client";

import { useState } from "react";

const sections = [
  {
    id: "metodo",
    label: "Método",
    eyebrow: "Centro do sistema",
    title: "O método organiza toda a operação.",
    body:
      "A aba central mostra como o processo funciona de ponta a ponta. O aluno acompanha a própria evolução em uma área dedicada e o João distribui os materiais no contexto certo.",
    bullets: [
      {
        label: "Aluno acompanha",
        text: "A evolução aparece por semana, com status, notas e progresso visível.",
      },
      {
        label: "João anexa",
        text: "Os materiais entram ligados ao aluno ou à tarefa, sem dispersão.",
      },
      {
        label: "Sistema guia",
        text: "Cada etapa fica organizada dentro do fluxo do método, não em cards soltos.",
      },
    ],
  },
  {
    id: "evolucao",
    label: "Evolução",
    eyebrow: "Acompanhamento do aluno",
    title: "O aluno enxerga seu progresso de forma simples.",
    body:
      "A tela de alunos concentra semana atual, avanço acumulado, renovação e observações. O progresso fica legível para o cliente e operacional para a equipe.",
    bullets: [
      {
        label: "Semana atual",
        text: "Mostra o avanço entre a semana 1 e a 6.",
      },
      {
        label: "Status",
        text: "Ativo, pausado ou finalizado, atualizado em um único ponto.",
      },
      {
        label: "Notas",
        text: "Observações acompanham a matrícula e não se perdem.",
      },
    ],
  },
  {
    id: "materiais",
    label: "Materiais",
    eyebrow: "Entrega operacional",
    title: "João anexa os materiais diretamente na rotina.",
    body:
      "Arquivos, referências e anexos ficam ligados ao aluno ou à tarefa. Isso evita conteúdo espalhado em conversa e deixa a entrega rastreável.",
    bullets: [
      {
        label: "Por aluno",
        text: "Cada matrícula pode receber materiais próprios.",
      },
      {
        label: "Por tarefa",
        text: "Anexos de operação e acompanhamento ficam centralizados.",
      },
      {
        label: "Consulta rápida",
        text: "A equipe acessa o conteúdo sem sair da tela em uso.",
      },
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
                key={bullet.label}
                className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4"
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                  {bullet.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/72">{bullet.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
