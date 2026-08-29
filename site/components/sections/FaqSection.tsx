"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
      <div className="section-header-badge">
        <span className="section-tag-prefix">{"// 06. DÚVIDAS FREQUENTES"}</span>
      </div>
      <h2 id="faq-heading">Perguntas frequentes</h2>
      <div className="faq-list">
        <FaqItem id="tools" question="Preciso instalar as duas ferramentas?">
          <p>
            Não. O instalador permite provisionar o ambiente completo (Claude Code + opencode) ou escolher apenas uma das ferramentas através de <code>-Tools claude</code> ou <code>-Tools opencode</code>.
          </p>
        </FaqItem>

        <FaqItem id="privacy" question="Meus dados ou chaves são enviados para algum lugar?">
          <p>
            Não. O repositório é 100% local e seguro. Os scripts apenas copiam
            arquivos de configuração para a sua máquina (%USERPROFILE% e %LOCALAPPDATA%). Nenhum dado pessoal, histórico de conversa ou chave de API é coletado ou transmitido.
          </p>
        </FaqItem>

        <FaqItem id="update" question="Como atualizo minhas configurações e skills?">
          <p>
            Basta rodar o comando de instalação novamente ou dar <code>git pull</code> no repositório clonado e executar o instalador local. Seus arquivos principais (como <code>settings.json</code> e <code>~/.claude.json</code>) são mesclados com backup prévio (<code>.pre-install.bak</code>), preservando suas preferências existentes.
          </p>
        </FaqItem>

        <FaqItem id="git" question="Preciso ter o Git instalado?">
          <p>
            Sem problemas! A <strong>Instalação Expressa (One-Liner)</strong> funciona diretamente pelo PowerShell nativo do Windows, sem depender do Git. Caso prefira a instalação manual, use o botão <strong>Baixar ZIP</strong> no topo da página, extraia a pasta e execute o script local.
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

        <FaqItem id="ratelimit" question="Preciso de um token do GitHub para fazer buscas?">
          <p>
            Não. A busca padrão é 100% anônima e gratuita (limitada a 60 requisições/hora pela API pública do GitHub). Se desejar fazer buscas intensivas ou escanear repositórios com muitos arquivos, você pode clicar em <strong>Configurar GitHub API</strong> no Hub e adicionar um Personal Access Token pessoal, elevando o limite para 5.000 requisições/hora com armazenamento exclusivo no seu navegador.
          </p>
        </FaqItem>

        <FaqItem id="license" question="Qual é a licença do projeto?">
          <p>
            O código deste repositório (scripts, documentação, site e instaladores) é distribuído sob a licença <a href="https://github.com/diego-ruas/maleta.dev/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT</a>. As skills e plugins de terceiros mantêm suas respectivas licenças originais de seus autores.
          </p>
        </FaqItem>
      </div>
    </Reveal>
  );
}
