"use client";

import { useState } from "react";

const tabs = [
  {
    id: "metodo",
    label: "Método",
    title: "O centro do sistema",
    description:
      "O aluno acompanha a própria evolução por etapas. João mantém a operação com materiais, marcos e histórico organizado.",
    points: [
      "Cada etapa segue uma cadência definida.",
      "O progresso do aluno fica visível por semana.",
      "As próximas ações são amarradas ao fluxo operacional.",
    ],
  },
  {
    id: "evolucao",
    label: "Evolução do aluno",
    title: "Acompanhamento semanal",
    description:
      "O aluno vê onde está, o que já concluiu e qual é o próximo passo. Isso reduz ruído e deixa a execução objetiva.",
    points: [
      "Semana 1 a 6 com progresso contínuo.",
      "Status, notas e renovação centralizados.",
      "Histórico simples para acompanhar avanço real.",
    ],
  },
  {
    id: "materiais",
    label: "Materiais",
    title: "João anexa os conteúdos",
    description:
      "A cada etapa, o time consegue anexar arquivos, guias e referências para manter tudo no mesmo lugar.",
    points: [
      "Materiais ligados ao aluno ou à tarefa.",
      "Anexos ficam prontos para consulta rápida.",
      "A entrega acompanha a execução, não fica solta.",
    ],
  },
] as const;

export function MethodTabs() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>(tabs[0].id);
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={
                active
                  ? "rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]"
                  : "rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5"
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-sand)]">
            {currentTab.label}
          </p>
          <h2 className="mt-3 font-display text-3xl">{currentTab.title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
            {currentTab.description}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/45">
            O que isso resolve
          </p>
          <ul className="mt-4 space-y-3 text-sm text-white/72">
            {currentTab.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-gold)]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
