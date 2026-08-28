"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatedIcon Icon={ArrowUpIcon} size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
