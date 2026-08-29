"use client";

import Image from "next/image";
import { motion } from "motion/react";
import AnimatedIcon from "@/components/AnimatedIcon";
import TypewriterText from "@/components/TypewriterText";
import DecryptedText from "@/components/DecryptedText";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal";
import { SearchIcon } from "@/components/icons/search";
import { useToolkit } from "@/lib/toolkitContext";

export default function Hero() {
  const { selectedSkills } = useToolkit();

  return (
    <section className="intro">
      <motion.div
        className="intro-copy"
        initial="hidden"
        animate="visible"
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
          <TypewriterText text="~/maleta.dev" speed={25} delay={80} />
        </motion.span>
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Monte seu toolkit de IA{" "}
          <span className="highlight-word">
            <DecryptedText text="sob medida" speed={30} maxIterations={10} />
          </span>
        </motion.h1>
        <motion.p
          className="intro-desc"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Coleção curada de skills, plugins e configurações para <span className="highlight-word">Claude Code</span> e{" "}
          <span className="highlight-word">opencode</span>. Escolha apenas as capacidades necessárias para o seu fluxo, monte seu pacote e execute seu instalador exclusivo no PowerShell.
        </motion.p>
        <motion.div
          className="intro-highlights"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <a href="#skills" className="intro-badge-item intro-badge-link" title="Ver presets e catálogo de skills">
            <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={16} />
            <span>{selectedSkills.size} skills selecionadas no seu pacote</span>
          </a>
          <a href="#repo-add" className="intro-badge-item intro-badge-link" title="Ir para o buscador de skills comunitárias">
            <AnimatedIcon Icon={SearchIcon} className="icon" size={16} />
            <span>Hub Comunitário — Importar do GitHub</span>
          </a>
        </motion.div>

        <motion.div
          className="intro-links"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="intro-actions">
            <a href="#skills" className="btn-gh">
              <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={16} />
              <span>Personalizar Skills & Presets</span>
            </a>
            <a href="#plugins" className="btn-gh">
              <span>Ver Plugins</span>
            </a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-mascot-wrapper"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Image
          src="/logo.png"
          alt="Mascote maleta.dev"
          width={240}
          height={240}
          priority
          className="hero-mascot-img"
        />
      </motion.div>
    </section>
  );
}
