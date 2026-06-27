export default function PortalClientesPage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden border border-[var(--color-gold)]/16 bg-[#091117] shadow-[var(--shadow-panel)]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-36"
          style={{ backgroundImage: "url('/portal-clientes-card.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.96),rgba(5,7,9,0.68),rgba(5,7,9,0.88))]" />
        <div className="relative px-6 py-8 lg:px-8 lg:py-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
            Clientes
          </p>
          <h2 className="mt-3 max-w-[9ch] font-display text-5xl leading-none text-[var(--color-paper)] sm:text-6xl">
            Operação do consultório.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-paper)]/72">
            Esta será a área para cadastrar clientes e leads, registrar consultas,
            organizar prontuários e manter anamneses centralizadas.
          </p>
        </div>
      </section>

      <section className="grid gap-px border border-[var(--color-gold)]/12 bg-[var(--color-gold)]/12 md:grid-cols-2 xl:grid-cols-4">
        <article className="bg-[var(--color-teal)]/92 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]/76">
            Cadastro
          </p>
          <p className="mt-3 text-base leading-7 text-[var(--color-gold-soft)]/78">
            Clientes, leads e dados centrais de contato.
          </p>
        </article>
        <article className="bg-[var(--color-teal)]/92 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]/76">
            Consultas
          </p>
          <p className="mt-3 text-base leading-7 text-[var(--color-gold-soft)]/78">
            Anotações por sessão, evolução e histórico clínico.
          </p>
        </article>
        <article className="bg-[var(--color-teal)]/92 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]/76">
            Prontuários
          </p>
          <p className="mt-3 text-base leading-7 text-[var(--color-gold-soft)]/78">
            Organização de prontuários e documentos essenciais.
          </p>
        </article>
        <article className="bg-[var(--color-teal)]/92 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]/76">
            Anamnese
          </p>
          <p className="mt-3 text-base leading-7 text-[var(--color-gold-soft)]/78">
            Estrutura para formulários e informações iniciais do cliente.
          </p>
        </article>
      </section>
    </div>
  );
}
