"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import AnimatedIcon from "@/components/AnimatedIcon";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="intro" aria-label="Apresentação do Maleta.dev">
      <motion.div
        className="intro-copy"
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.05 },
          },
        }}
      >
        <motion.span
          className="hero-prompt"
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          ~/maleta.dev - Custom AI Toolkit Builder
        </motion.span>

        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <span>
            Monte seu toolkit de IA{" "}
            <span className="highlight-word">sob medida</span>
          </span>
        </motion.h1>

        <motion.p
          className="intro-desc"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          O Maleta.dev não instala nada sozinho: é um construtor que gera um comando de instalação a partir das skills, plugins e presets de IA que você escolher no catálogo abaixo. Você vê o comando completo, copia e roda quando quiser, no seu terminal, para <span className="highlight-word">Claude Code</span>, <span className="highlight-word">Codex</span> ou outras IDEs.
        </motion.p>

        <motion.div
          className="intro-links"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="intro-actions">
            <a href="#skills" className="btn-primary">
              <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={16} />
              <span>Começar a montar</span>
            </a>
            <a
              href="https://github.com/diego-ruas/maleta.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gh"
            >
              <span>Ver no GitHub</span>
              <AnimatedIcon Icon={ArrowUpRightIcon} className="icon" size={16} />
            </a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="intro-logo"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image src="/logo.png" alt="" width={320} height={320} priority />
      </motion.div>
    </section>
  );
}
