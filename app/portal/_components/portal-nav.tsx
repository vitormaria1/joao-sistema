"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/portal", label: "Início" },
  { href: "/portal/programa/candeeiro", label: "Candeeiro" },
  { href: "/portal/programa/vigilia", label: "Vigília" },
  { href: "/portal/clientes", label: "Clientes" },
  { href: "/portal/suporte", label: "Suporte" },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-3">
      {navItems.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "rounded-full border border-[var(--color-gold)]/24 bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-night)]"
                : "rounded-full border border-[var(--color-gold)]/18 bg-black/10 px-4 py-2 text-sm text-[var(--color-gold-soft)]/78 transition hover:bg-black/18"
            }
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
