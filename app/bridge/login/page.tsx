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
    <main className="relative min-h-screen overflow-hidden bg-[#1b232d] text-[var(--color-paper)]">
      <div
        className="absolute inset-0 bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: "url('/login-art.png')", backgroundSize: "min(78vw, 980px)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(27,35,45,0.2)_35%,rgba(27,35,45,0.82)_100%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10">
        <section className="w-full max-w-md rounded-[2rem] border border-[#e8e1c2]/18 bg-[#1b232d]/72 p-8 shadow-[0_28px_80px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          <h1 className="text-center font-display text-3xl leading-tight text-[#efe8c9] sm:text-4xl">
            O TRABALHO DOS BONS
            <br />
            PRECISA SER VISTO.
          </h1>

          <form action={signInWithPassword} className="mt-10 space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <input
              type="email"
              name="email"
              required
              placeholder="E-mail"
              className="h-12 w-full rounded-full border border-[#efe8c9]/22 bg-black/18 px-5 text-sm text-[#f6f1dc] outline-none transition placeholder:text-[#f6f1dc]/42 focus:border-[#efe8c9]/55"
            />

            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="Senha"
              className="h-12 w-full rounded-full border border-[#efe8c9]/22 bg-black/18 px-5 text-sm text-[#f6f1dc] outline-none transition placeholder:text-[#f6f1dc]/42 focus:border-[#efe8c9]/55"
            />

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#efe8c9] px-6 text-sm font-semibold text-[#1b232d] transition hover:bg-[#f6f1dc]"
            >
              Entrar
            </button>
          </form>

          {params.error ? (
            <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-500/14 px-4 py-3 text-sm text-red-100">
              {params.error}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
