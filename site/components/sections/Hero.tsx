"use client";

import { motion, useReducedMotion } from "motion/react";
import AnimatedIcon from "@/components/AnimatedIcon";
import AnimatedCounter from "@/components/AnimatedCounter";
import CopyButton from "@/components/CopyButton";
import TypewriterText from "@/components/TypewriterText";
import DecryptedText from "@/components/DecryptedText";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal";
import { CopyIcon } from "@/components/icons/copy";
import { CheckIcon } from "@/components/icons/check";
import { ShieldIcon } from "@/components/icons/shield";
import { useToolkit } from "@/lib/toolkitContext";
import { SKILLS } from "@/lib/data";

export default function Hero() {
  const { selectedSkills, targetOs, installCommand } = useToolkit();
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
          <TypewriterText text="~/maleta.dev - Custom AI Toolkit Builder" speed={16} delay={40} />
        </motion.span>

        <motion.h1
          aria-label="Monte seu toolkit de IA sob medida"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <span aria-hidden="true">
            Monte seu toolkit de IA{" "}
            <span className="highlight-word">
              <DecryptedText text="sob medida" speed={22} maxIterations={6} />
            </span>
          </span>
        </motion.h1>

        <motion.p
          className="intro-desc"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Escolha uma base, ajuste o pacote e copie um comando pronto para instalar skills no <span className="highlight-word">Claude Code</span>, <span className="highlight-word">Codex</span> ou outras IDEs.
        </motion.p>

        <motion.div
          className="intro-highlights"
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <a href="#skills" className="intro-badge-item intro-badge-link" title={`Explorar ${SKILLS.length} skills curadas`}>
            <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={15} />
            <span>{SKILLS.length} skills curadas</span>
          </a>
          <a href="#sobre" className="intro-badge-item intro-badge-link" title="Saiba como funciona o provisionamento local">
            <AnimatedIcon Icon={ShieldIcon} className="icon" size={15} />
            <span>Instalação local - configuração sob seu controle</span>
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
            <a href="#skills" className="btn-primary">
              <AnimatedIcon Icon={SlidersHorizontalIcon} className="icon" size={16} />
              <span>Começar a montar &rarr;</span>
            </a>
            <a
              href="https://github.com/diego-ruas/maleta.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gh"
            >
              <span>Ver no GitHub &rarr;</span>
            </a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-console-wrapper"
        id="configurador"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 10 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="hero-terminal">
          <div className="hero-terminal-header">
            <div className="hero-terminal-header-left">
              <div className="terminal-dots" aria-hidden="true">
                <span className="terminal-dot" />
                <span className="terminal-dot" />
                <span className="terminal-dot" />
              </div>
              <span className="terminal-title">{targetOs === "unix" ? "quick-setup.sh" : "quick-setup.ps1"}</span>
            </div>
            <span className="terminal-badge"><AnimatedCounter value={selectedSkills.size} /> SKILLS</span>
          </div>

          <div className="hero-terminal-body">
            <div className="hero-terminal-section">
              <span className="hero-section-label">COMANDO PRONTO:</span>
              <div className="hero-code-box">
                <pre>
                  <code>{installCommand}</code>
                </pre>
                <CopyButton
                  className="hero-code-copy-btn"
                  text={installCommand}
                  aria-label="Copiar comando de instalação"
                  title="Copiar comando completo para a área de transferência"
                >
                  <AnimatedIcon Icon={CopyIcon} className="icon icon-copy" size={15} />
                  <AnimatedIcon Icon={CheckIcon} className="icon icon-check" size={15} />
                </CopyButton>
              </div>
            </div>

            <p className="hero-command-hint">
              {`// O comando inicial instala a base recomendada. Personalize o alvo e as skills no catálogo.`}
            </p>

            <div className="hero-terminal-actions">
              <span className="hero-terminal-actions-hint">
                {`// Clique no ícone acima para copiar o comando`}
              </span>
              <a href="#skills" className="hero-terminal-explore-link">
                Personalizar no Catálogo &rarr;
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
