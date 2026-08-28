import AnimatedIcon from "@/components/AnimatedIcon";
import Reveal from "@/components/Reveal";
import { ChevronDownIcon } from "@/components/icons/chevron-down";

export default function FaqSection() {
  return (
    <Reveal id="faq" className="reveal" ariaLabelledby="faq-heading">
      <h2 id="faq-heading">Perguntas frequentes</h2>
      <div className="faq-list">
        <details className="faq-item">
          <summary>
            Preciso instalar as duas ferramentas?
            <AnimatedIcon Icon={ChevronDownIcon} className="icon faq-caret" size={16} />
          </summary>
          <p>
            Não. O <code>scripts/install.ps1</code> instala tudo, mas cada
            pasta tem o próprio <code>install.ps1</code> — rode só o da
            ferramenta que você usa. O repo também tem uma pasta{" "}
            <code>antigravity/</code>, mas ela é um placeholder: hoje o
            instalador dela não copia nada.
          </p>
        </details>
        <details className="faq-item">
          <summary>
            Meus dados são enviados para algum lugar?
            <AnimatedIcon Icon={ChevronDownIcon} className="icon faq-caret" size={16} />
          </summary>
          <p>
            Não. O repositório é instalação somente: os scripts copiam
            arquivos para a sua máquina e nada do seu ambiente é enviado de
            volta.
          </p>
        </details>
        <details className="faq-item">
          <summary>
            Como atualizo depois de instalar?
            <AnimatedIcon Icon={ChevronDownIcon} className="icon faq-caret" size={16} />
          </summary>
          <p>
            Rode <code>git pull</code> na pasta clonada e execute o
            instalador da ferramenta de novo — ele recopia skills e
            configurações por cima. <code>settings.json</code> e{" "}
            <code>~/.claude.json</code> são mesclados e ganham um{" "}
            <code>.pre-install.bak</code> antes; já o{" "}
            <code>~/.claude/CLAUDE.md</code> é sobrescrito sem backup. Nada é
            removido: tirar uma skill do repo não a apaga de{" "}
            <code>~/.claude/skills/</code>.
          </p>
        </details>
        <details className="faq-item">
          <summary>
            Sem Git na máquina?
            <AnimatedIcon Icon={ChevronDownIcon} className="icon faq-caret" size={16} />
          </summary>
          <p>
            Use o botão <strong>Baixar ZIP</strong> no topo da página, extraia
            a pasta e rode o instalador como no passo 03.
          </p>
        </details>
        <details className="faq-item">
          <summary>
            Precisa de administrador?
            <AnimatedIcon Icon={ChevronDownIcon} className="icon faq-caret" size={16} />
          </summary>
          <p>
            Não. Os scripts só escrevem em <code>%USERPROFILE%</code> e{" "}
            <code>%LOCALAPPDATA%</code>. O{" "}
            <code>-ExecutionPolicy Bypass</code> serve apenas para o Windows
            aceitar rodar um script não assinado — não altera a política da
            máquina.
          </p>
        </details>
        <details className="faq-item">
          <summary>
            Qual é a licença?
            <AnimatedIcon Icon={ChevronDownIcon} className="icon faq-caret" size={16} />
          </summary>
          <p>
            O wrapper do repositório (scripts, docs, configurações) é MIT. As
            skills de terceiros dentro de <code>claude/skills/</code>{" "}
            pertencem aos seus autores e mantêm as próprias licenças.
          </p>
        </details>
      </div>
    </Reveal>
  );
}
