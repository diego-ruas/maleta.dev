"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import AnimatedIcon from "@/components/AnimatedIcon";
import Reveal from "@/components/Reveal";
import { ChevronDownIcon } from "@/components/icons/chevron-down";

interface FaqItemProps {
  id: string;
  question: string;
  children: React.ReactNode;
}

function FaqItem({ id, question, children }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className={`faq-item${isOpen ? " open" : ""}`}>
      <button
        type="button"
        id={`faq-btn-${id}`}
        className="faq-summary"
        aria-expanded={isOpen}
        aria-controls={`faq-content-${id}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{question}</span>
        <motion.span
          className="faq-caret-wrap"
          animate={reduceMotion ? undefined : { rotate: isOpen ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatedIcon Icon={ChevronDownIcon} className="icon faq-caret" size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-content-${id}`}
            role="region"
            aria-labelledby={`faq-btn-${id}`}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="faq-content"
          >
            <div className="faq-body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  return (
    <Reveal id="faq" className="reveal" ariaLabelledby="faq-heading">
      <h2 id="faq-heading">Perguntas frequentes</h2>
      <div className="faq-list">
        <FaqItem id="tools" question="Onde as skills vão parar na minha máquina?">
          <p>
            O parâmetro <code>-Tools</code> define exatamente quais diretórios da sua máquina receberão as skills:
          </p>
          <ul className="faq-list-detail">
            <li><strong>Claude Code (<code>-Tools claude</code>)</strong>: Injeta apenas em <code>~/.claude/skills/</code> e <code>settings.json</code>.</li>
            <li><strong>Codex (<code>-Tools codex</code>)</strong>: Injeta as skills em <code>~/.agents/skills/</code> e os servidores MCP em <code>~/.codex/config.toml</code>.</li>
            <li><strong>Agentes & IDEs (<code>-Tools agents</code>)</strong>: Injeta as skills em <code>~/.agents/skills/</code> para Antigravity, Cursor, Windsurf, Cline, Roo Code, Gemini e Codex.</li>
            <li><strong>Todos / Completo (<code>-Tools all</code>)</strong>: Instalação total que sincroniza simultaneamente o Claude Code, Codex e todas as IDEs/Agentes.</li>
          </ul>
        </FaqItem>

        <FaqItem id="builder" question="Como o site gera o instalador customizado em 1 clique?">
          <p>
            O construtor na Hero e na seção de Skills compõe um comando PowerShell determinístico que invoca remotamente o script oficial <code>https://maleta.dev/install.ps1</code>, parametrizando apenas o alvo (<code>-Tools</code>) e a lista exata das skills selecionadas (<code>-Skills @(...)</code>). Nada além do estritamente escolhido é instalado.
          </p>
        </FaqItem>

        <FaqItem id="privacy" question="Meus dados ou chaves são enviados para algum lugar?">
          <p>
            Não. O repositório é 100% local e seguro. Os scripts apenas copiam arquivos de configuração para a sua máquina (<code>%USERPROFILE%</code> e <code>%LOCALAPPDATA%</code>). Nenhum dado pessoal, histórico de conversa ou chave de API é coletado ou transmitido.
          </p>
        </FaqItem>

        <FaqItem id="update" question="Como o instalador preserva minhas configurações existentes?">
          <p>
            Antes de qualquer alteração, o instalador cria um backup automático dos arquivos existentes (como <code>settings.json.pre-install.bak</code>) e realiza a mescla inteligente de configurações e plugins, garantindo que suas preferências pré-existentes nunca sejam sobrescritas de forma destrutiva.
          </p>
        </FaqItem>

        <FaqItem id="git" question="Preciso ter o Git instalado?">
          <p>
            Não. A <strong>Instalação Expressa (One-Liner)</strong> funciona diretamente pelo PowerShell nativo do Windows (PowerShell 5.1+), sem depender de Git instalado. Caso prefira a instalação manual local, você pode clonar o repositório ou baixar o script <code>.ps1</code> gerado pelo site.
          </p>
        </FaqItem>

        <FaqItem id="admin" question="Preciso de privilégios de administrador?">
          <p>
            Não. Os scripts gravam apenas nos diretórios do seu próprio usuário (<code>%USERPROFILE%</code> e <code>%LOCALAPPDATA%</code>). O parâmetro <code>-ExecutionPolicy Bypass</code> serve apenas para que o PowerShell aceite rodar o script na sessão atual, sem alterar as políticas de segurança globais do Windows.
          </p>
        </FaqItem>

        <FaqItem id="hub" question="Como funciona o Hub Comunitário no site?">
          <p>
            O Hub se conecta diretamente à API pública do GitHub para buscar repositórios com a tag <code>topic:claude-skills</code> e repositórios oficiais/upstream (como <code>anthropics/skills</code> e <code>cloudflare/skills</code>). Ele localiza arquivos <code>SKILL.md</code>, extrai suas instruções e permite adicioná-las à sua seleção personalizada com 1 clique.
          </p>
        </FaqItem>

        <FaqItem id="license" question="Qual é a licença do projeto?">
          <p>
            O código deste repositório (scripts, documentação, site e instaladores) é distribuído sob a licença <a href="https://github.com/diego-ruas/maleta.dev/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT</a>. As skills e plugins de terceiros mantêm suas respectivas licenças originais de seus autores.
          </p>
        </FaqItem>

        <FaqItem id="agentes" question="Qual a diferença entre Claude Code e Codex?">
          <p>
            São dois agentes de terminal diferentes: o <strong>Claude Code</strong> é da Anthropic, o <strong>Codex</strong> é da OpenAI. Você pode usar os dois na mesma máquina. As skills deste site funcionam nos dois, porque ambos leem arquivos <code>SKILL.md</code>; o instalador só muda a pasta de destino.
          </p>
        </FaqItem>

        <FaqItem id="iniciante" question="Nunca usei nenhum dos dois. Por onde começo?">
          <p>
            Instale um agente com <code>npm install -g @anthropic-ai/claude-code</code> (ou <code>npm install -g @openai/codex</code>), cole o comando pronto que aparece no topo desta página e reabra o terminal. Depois digite <code>/skills</code> dentro do agente para ver o que foi instalado.
          </p>
        </FaqItem>
      </div>
    </Reveal>
  );
}
