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
    <main className="min-h-screen bg-[#1b232d] text-[var(--color-paper)]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6 py-10">
        <section className="w-full max-w-md">
          <img
            src="/login-art.png"
            alt=""
            className="mx-auto mb-10 w-full max-w-[320px]"
          />

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
              className="h-12 w-full border-b border-[#efe8c9]/32 bg-transparent px-0 text-sm text-[#f6f1dc] outline-none transition placeholder:text-[#f6f1dc]/42 focus:border-[#efe8c9]"
            />

            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="Senha"
              className="h-12 w-full border-b border-[#efe8c9]/32 bg-transparent px-0 text-sm text-[#f6f1dc] outline-none transition placeholder:text-[#f6f1dc]/42 focus:border-[#efe8c9]"
            />

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center border border-[#efe8c9] bg-transparent px-6 text-sm font-semibold text-[#efe8c9] transition hover:bg-[#efe8c9] hover:text-[#1b232d]"
            >
              Entrar
            </button>
          </form>

          {params.error ? (
            <p className="mt-4 border-l-2 border-red-300/60 pl-3 text-sm text-red-100">
              {params.error}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
