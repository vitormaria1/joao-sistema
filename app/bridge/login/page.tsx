import Link from "next/link";
import { redirect } from "next/navigation";
import { signInWithPassword } from "@/app/bridge/login/actions";
import { getAuthenticatedUser } from "@/lib/auth";
import { normalizeInternalPath } from "@/lib/paths";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getAuthenticatedUser();
  const params = await searchParams;
  const nextPath = normalizeInternalPath(params.next, "/dashboard");

  if (user) {
    redirect(nextPath);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(31,103,119,0.2),transparent_26%),linear-gradient(180deg,#17181d_0%,#22242b_100%)] px-6 py-10 text-[var(--color-paper)]">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl gap-6 lg:grid-cols-[1fr_420px]">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-sand)]">
              Joao Sistema
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-6xl leading-none">
              Clareza operacional para mentoria, vendas e progresso dos clientes.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
              Acesse com e-mail e senha para entrar no painel operacional.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Acompanhamento semanal do Candeeiro",
              "CRM comercial com follow-up",
              "Tarefas e materiais num só lugar",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4 text-sm leading-6 text-white/75"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-[#f3ede2] p-7 text-[var(--color-ink)] shadow-[0_25px_80px_rgba(0,0,0,0.22)]">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-teal)]">
              Acesso
            </p>
            <h2 className="mt-2 font-display text-4xl leading-none">
              Entrar no sistema
            </h2>
          </div>

          <form action={signInWithPassword} className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <label className="block">
              <span className="mb-2 block text-sm font-medium">E-mail</span>
              <input
                type="email"
                name="email"
                required
                placeholder="voce@exemplo.com"
                className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 outline-none transition focus:border-[var(--color-teal)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Senha</span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Sua senha"
                className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 outline-none transition focus:border-[var(--color-teal)]"
              />
            </label>

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-ink)] px-6 text-sm font-semibold text-[var(--color-paper)] transition hover:bg-black"
            >
              Entrar
            </button>
          </form>

          {params.error ? (
            <p className="mt-4 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-800">
              {params.error}
            </p>
          ) : null}

          {params.success ? (
            <p className="mt-4 rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800">
              {params.success}
            </p>
          ) : null}

          <div className="mt-6 text-sm text-black/60">
            <Link href="/" className="underline underline-offset-4">
              Voltar para a apresentação
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
