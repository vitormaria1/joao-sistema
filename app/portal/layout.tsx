import type { ReactNode } from "react";
import { signOut } from "@/app/bridge/login/actions";
import { requireStudentSession } from "@/lib/auth";
import { PortalNav } from "@/app/portal/_components/portal-nav";

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { profile } = await requireStudentSession("/portal");

  return (
    <main className="min-h-screen bg-[var(--color-night)] px-4 py-4 text-[var(--color-paper)] lg:px-6 lg:py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-[var(--color-gold)]/18 bg-[linear-gradient(180deg,rgba(15,93,115,0.9),rgba(13,24,32,0.96))] px-6 py-6 shadow-[var(--shadow-panel)] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-gold)]">
              Area do aluno
            </p>
            <h1 className="mt-3 font-display text-4xl text-[var(--color-gold-soft)]">
              {profile.full_name}
            </h1>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <PortalNav />
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-[var(--color-gold)]/18 bg-black/12 px-4 py-2 text-sm text-[var(--color-gold-soft)]/82 transition hover:bg-black/20"
              >
                Sair
              </button>
            </form>
          </div>
        </header>

        {children}
      </div>
    </main>
  );
}
