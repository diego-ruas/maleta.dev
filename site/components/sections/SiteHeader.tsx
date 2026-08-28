"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#ferramentas", label: "O que tem" },
  { href: "#skills", label: "Skills" },
  { href: "#plugins", label: "Plugins" },
  { href: "#instalar", label: "Instalar" },
  { href: "#seguranca", label: "Segurança" },
  { href: "#faq", label: "FAQ" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const ids = NAV_LINKS.map((link) => link.href.replace("#", ""));
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(ids[i]);
          return;
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = activeSection === href.replace("#", "");
            return (
              <li key={href}>
                <a href={href} className={isActive ? "active" : ""}>
                  {label}
                </a>
              </li>
            );
          })}
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
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = activeSection === href.replace("#", "");
            return (
              <li key={href}>
                <a href={href} className={isActive ? "active" : ""} onClick={close}>
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}