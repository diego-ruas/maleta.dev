"use client";

import { useEffect, useState } from "react";
import AnimatedIcon from "@/components/AnimatedIcon";
import { ArrowUpIcon } from "@/components/icons/arrow-up";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "instant" : "smooth",
    });
  };

  return (
    <button
      type="button"
      className={`back-to-top${visible ? " visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      tabIndex={visible ? 0 : -1}
    >
      <AnimatedIcon Icon={ArrowUpIcon} size={18} />
    </button>
  );
}
