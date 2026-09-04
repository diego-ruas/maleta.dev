"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#skills", label: "Skills" },
  { href: "#plugins", label: "Plugins" },
  { href: "#faq", label: "FAQ" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const header = headerRef.current;
    const ids = NAV_LINKS.map((link) => link.href.replace("#", ""));
    let observer: IntersectionObserver | null = null;

    // O header tem flex-wrap e muda de altura conforme a viewport; o rootMargin
    // depende dessa altura, entao o observer e refeito a cada resize dele.
    function observeSections() {
      observer?.disconnect();
      const headerHeight = header?.offsetHeight ?? 96;
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible) setActiveSection(visible.target.id);
        },
        { rootMargin: `-${headerHeight}px 0px -55% 0px`, threshold: [0, 0.25, 0.5, 1] }
      );
      for (const id of ids) {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      }
    }

    observeSections();
    if (!header) return () => observer?.disconnect();

    const ro = new ResizeObserver(observeSections);
    ro.observe(header);
    return () => {
      ro.disconnect();
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    firstMobileLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <motion.header
      ref={headerRef}
      initial={reduceMotion ? false : { opacity: 0, y: -10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href="/" className="site-name" onClick={close}>
        <Image
          src="/logo.png"
          alt="Mascote da Maleta.dev"
          width={28}
          height={28}
          className="site-logo"
          priority
        />
        <span className="site-title">Maleta.dev</span>
      </Link>

      <nav aria-label="Navegação principal" className="nav-desktop">
        <ul className="nav-links">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = activeSection === href.replace("#", "");
            return (
              <li key={href}>
                <a href={href} className={isActive ? "active" : ""} aria-current={isActive ? "location" : undefined}>
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
        ref={menuToggleRef}
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
        inert={!open}
      >
        <ul>
          {NAV_LINKS.map(({ href, label }, i) => {
            const isActive = activeSection === href.replace("#", "");
            return (
              <li key={href}>
                <a
                  href={href}
                  ref={i === 0 ? firstMobileLinkRef : undefined}
                  className={isActive ? "active" : ""}
                  aria-current={isActive ? "location" : undefined}
                  onClick={close}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.header>
  );
}
