import { redirect } from "next/navigation";
import { sendMagicLink, signInWithPassword } from "@/app/bridge/login/actions";
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
    <main className="min-h-screen bg-[var(--color-night-soft)] text-[var(--color-paper)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section
          className="relative min-h-[42vh] bg-[var(--color-night-soft)] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/login-art.png')" }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,24,32,0.2),rgba(13,24,32,0.52))]" />
        </section>

        <section className="flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            <p className="text-center text-xs uppercase tracking-[0.35em] text-[var(--color-gold)]">
              Joao Sistema
            </p>
            <h1 className="mt-4 text-center font-display text-3xl leading-tight text-[#efe8c9] sm:text-4xl">
              O TRABALHO DOS BONS
              <br />
              PRECISA SER VISTO.
            </h1>
            <p className="mt-4 text-center text-sm leading-7 text-[#efe8c9]/72">
              Acesse o painel com identidade editorial, operação clara e visão de
              progresso num só lugar.
            </p>

            <form action={signInWithPassword} className="mt-10 space-y-4">
              <input type="hidden" name="next" value={nextPath} />
              <input
                type="email"
                name="email"
                required
                defaultValue="teste.nav@varinteligencia.com"
                placeholder="E-mail"
                className="h-12 w-full rounded-md border border-[#efe8c9]/26 bg-[#1b232d]/52 px-4 text-sm text-[#f6f1dc] outline-none transition placeholder:text-[#f6f1dc]/42 focus:border-[#efe8c9]"
              />

              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Senha"
                className="h-12 w-full rounded-md border border-[#efe8c9]/26 bg-[#1b232d]/52 px-4 text-sm text-[#f6f1dc] outline-none transition placeholder:text-[#f6f1dc]/42 focus:border-[#efe8c9]"
              />

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center border border-[#efe8c9] bg-transparent px-6 text-sm font-semibold text-[#efe8c9] transition hover:bg-[#efe8c9] hover:text-[#1b232d]"
              >
                Entrar
              </button>
            </form>

            <div className="mt-8 border-t border-[#efe8c9]/14 pt-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
                Link mágico
              </p>
              <p className="mt-2 text-sm leading-6 text-[#efe8c9]/66">
                Se preferir, solicite o acesso por e-mail.
              </p>

              <form action={sendMagicLink} className="mt-4 space-y-4">
                <input type="hidden" name="next" value={nextPath} />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Seu nome"
                  className="h-12 w-full rounded-md border border-[#efe8c9]/26 bg-[#1b232d]/52 px-4 text-sm text-[#f6f1dc] outline-none transition placeholder:text-[#f6f1dc]/42 focus:border-[#efe8c9]"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="voce@exemplo.com"
                  className="h-12 w-full rounded-md border border-[#efe8c9]/26 bg-[#1b232d]/52 px-4 text-sm text-[#f6f1dc] outline-none transition placeholder:text-[#f6f1dc]/42 focus:border-[#efe8c9]"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center rounded-md bg-[var(--color-gold)] px-6 text-sm font-semibold text-[var(--color-night)] transition hover:bg-[#e2d098]"
                >
                  Enviar link de acesso
                </button>
              </form>
            </div>

            {params.error ? (
              <p className="mt-4 border-l-2 border-red-300/60 pl-3 text-sm text-red-100">
                {params.error}
              </p>
            ) : null}

            {params.success ? (
              <p className="mt-4 border-l-2 border-emerald-300/60 pl-3 text-sm text-emerald-100">
                {params.success}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
