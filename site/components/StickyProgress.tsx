"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AnimatedIcon from "@/components/AnimatedIcon";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal";
import { ChevronRightIcon } from "@/components/icons/chevron-right";
import { useToolkit } from "@/lib/toolkitContext";

export default function StickyProgress() {
  const { selectedSkills } = useToolkit();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const count = selectedSkills.size;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#skills"
          className="sticky-progress"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatedIcon Icon={SlidersHorizontalIcon} size={16} />
          <span className="sticky-progress-count">
            <strong>{count}</strong> skill{count === 1 ? "" : "s"} selecionada{count === 1 ? "" : "s"}
          </span>
          <span className="sticky-progress-cta">
            Ver catálogo
            <AnimatedIcon Icon={ChevronRightIcon} size={14} />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
