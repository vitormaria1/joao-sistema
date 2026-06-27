export default function PortalSuportePage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden border border-[var(--color-gold)]/16 bg-[#091117] shadow-[var(--shadow-panel)]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-38"
          style={{ backgroundImage: "url('/portal-suporte-card.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.96),rgba(5,7,9,0.68),rgba(5,7,9,0.88))]" />
        <div className="relative px-6 py-8 lg:px-8 lg:py-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
            Suporte
          </p>
          <h2 className="mt-3 max-w-[8ch] font-display text-5xl leading-none text-[var(--color-paper)] sm:text-6xl">
            Canal com o professor.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-paper)]/72">
            Este espaço será o histórico central de conversa entre aluno e
            professor, com mensagens persistidas e leitura contínua do contexto.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <aside className="border border-[var(--color-gold)]/16 bg-[var(--color-teal)]/92 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
            Conversas
          </p>
          <div className="mt-5 border border-[var(--color-gold)]/12 bg-black/12 p-4">
            <p className="font-medium text-[var(--color-gold-soft)]">
              Suporte geral
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-gold-soft)]/68">
              Aqui ficarão as conversas salvas entre aluno e professor.
            </p>
          </div>
        </aside>

        <section className="border border-[var(--color-gold)]/16 bg-[var(--color-teal)]/92 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
            Chat
          </p>
          <div className="mt-5 min-h-[320px] border border-[var(--color-gold)]/12 bg-black/12 p-5">
            <p className="text-sm leading-7 text-[var(--color-gold-soft)]/72">
              A interface do chat foi preparada como destino do card. O próximo
              passo aqui é ligar envio, persistência e histórico de mensagens no
              banco para manter as conversas salvas.
            </p>
          </div>
        </section>
      </section>
    </div>
  );
}
