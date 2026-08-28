"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

interface RevealProps {
  id: string;
  className?: string;
  ariaLabelledby: string;
  children: ReactNode;
}

export default function Reveal({ id, className, ariaLabelledby, children }: RevealProps) {
  return (
    <motion.section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}
