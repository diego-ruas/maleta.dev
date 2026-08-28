"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#seguranca", label: "Segurança" },
  { href: "#instalar", label: "Instalar" },
  { href: "#ferramentas", label: "O que tem" },
  { href: "#skills", label: "Skills" },
  { href: "#plugins", label: "Plugins" },
  { href: "#faq", label: "FAQ" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header>
      <Link href="/" className="site-name" aria-current="page" onClick={close}>
        <span>Maleta.dev</span>
      </Link>

      <nav aria-label="Navegação principal" className="nav-desktop">
        <ul className="nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        className="menu-toggle"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="menu-toggle__line" />
        <span className="menu-toggle__line" />
        <span className="menu-toggle__line" />
      </button>

      <nav
        id="mobile-menu"
        aria-label="Navegação mobile"
        className={`mobile-menu${open ? " is-open" : ""}`}
      >
        <ul>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={close}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}