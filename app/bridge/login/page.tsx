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
      <div className="grid min-h-screen lg:grid-cols-2">
        <section
          className="min-h-[42vh] bg-[#1b232d] bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('/login-art.png')" }}
        />

        <section className="flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
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

            {params.error ? (
              <p className="mt-4 border-l-2 border-red-300/60 pl-3 text-sm text-red-100">
                {params.error}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
