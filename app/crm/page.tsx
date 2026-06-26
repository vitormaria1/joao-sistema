import Link from "next/link";

import { SiteShell } from "@/app/_components/site-shell";
import { getCurrentProfile } from "@/lib/auth";

const FALLBACK_TWENTY_URL = "http://187.127.33.19:3001";

function getCrmUrl() {
  return process.env.NEXT_PUBLIC_TWENTY_URL ?? FALLBACK_TWENTY_URL;
}

export default async function CrmPage() {
  const profile = await getCurrentProfile();
  const crmUrl = getCrmUrl();

  return (
    <SiteShell
      title="CRM"
      subtitle={`${profile.full_name} · Twenty CRM conectado.`}
      accent="dark"
    >
      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <article className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-white/50">Nova base de CRM</p>
          <h1 className="mt-4 font-display text-4xl text-white md:text-5xl">
            O CRM agora abre a instância do Twenty nesta VPS.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
            Essa abordagem evita reconstruir o módulo de CRM dentro do sistema atual e
            permite testar agora mesmo em uma instalação própria.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={crmUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-gold)] px-5 text-sm font-medium text-black transition hover:opacity-90"
            >
              Abrir Twenty
            </Link>
            <span className="inline-flex h-11 items-center rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white/70">
              {crmUrl}
            </span>
          </div>
        </article>

        <aside className="rounded-[1.75rem] border border-white/10 bg-black/10 p-6">
          <h2 className="font-semibold text-white">Como usar</h2>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-white/65">
            <li>1. Clique em "Abrir Twenty".</li>
            <li>2. Faça login na instância externa do CRM.</li>
            <li>3. Quando escolher o domínio final, trocamos a URL por `crm.seudominio`.</li>
          </ol>

          <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">Fallback atual</p>
            <p className="mt-2 text-sm text-white/80">{FALLBACK_TWENTY_URL}</p>
          </div>
        </aside>
      </section>
    </SiteShell>
  );
}
