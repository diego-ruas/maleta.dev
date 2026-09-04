import type { Metadata } from "next";
import Link from "next/link";
import DocPage from "@/components/sections/DocPage";
import { CONTACT_EMAIL, REPO_URL } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: "Sobre | Maleta.dev",
  description:
    "O que é o Maleta.dev, quem mantém o projeto, como ele é construído e quais garantias de privacidade e licenciamento ele oferece.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <DocPage
      title="Sobre o Maleta.dev"
      lead="Um construtor e catálogo aberto de skills, plugins e configurações para assistentes de IA de código."
    >
      <h2>O que é</h2>
      <p>
        O Maleta.dev é um projeto de código aberto que reúne, cataloga e instala skills, presets,
        plugins e arquivos de configuração para dois assistentes de IA de linha de comando: o Claude
        Code, da Anthropic, e o Codex, da OpenAI. Uma skill é um pacote de instruções que o agente
        carrega automaticamente antes de trabalhar — na prática, um manual de conduta que padroniza
        como ele investiga um bug, escreve um teste ou revisa uma interface. Sem esse manual, cada
        agente aplica critérios próprios e inconsistentes a cada sessão.
      </p>
      <p>
        Em vez de distribuir um pacote monolítico, o site funciona como um construtor sob medida: o
        desenvolvedor escolhe um preset, marca skills específicas, importa skills da comunidade
        publicadas no GitHub e recebe um comando de instalação único, gerado para a seleção feita.
        São mais de 80 skills catalogadas, organizadas por categorias como acessibilidade, animação,
        testes, design de interface, infraestrutura e documentação.
      </p>

      <h2>Como funciona a instalação</h2>
      <p>
        A instalação acontece por um script único — <code>install.ps1</code> no Windows,{" "}
        <code>install.sh</code> em macOS e Linux — que copia os arquivos escolhidos para os
        diretórios de configuração locais do Claude Code e do Codex. Antes de sobrescrever qualquer
        configuração existente, o script cria um backup com a extensão <code>.pre-install.bak</code>,
        de modo que qualquer instalação possa ser revertida manualmente.
      </p>

      <h2>Privacidade e licenciamento</h2>
      <p>
        O projeto é estritamente de instalação: nada é enviado de volta. Não há telemetria, não há
        coleta de credenciais, não há sincronização de histórico de sessões e nenhuma chave de API é
        lida ou transmitida. Todo o processamento acontece na máquina do usuário. As skills de
        terceiros incluídas no catálogo são cópias fiéis dos artefatos originais, mantidas sem
        modificação e com as licenças upstream intactas. O código do próprio Maleta.dev é
        licenciado sob MIT. Detalhes em <Link href="/privacy">nossa página de privacidade</Link>.
      </p>

      <h2>Quem mantém</h2>
      <p>
        O projeto é mantido por Diego Ruas e desenvolvido de forma aberta em{" "}
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
          github.com/diego-ruas/maleta.dev
        </a>
        . Correções, novas skills e relatos de problemas são bem-vindos por issue ou pull request. Para
        contato direto, escreva para <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ou veja a{" "}
        <Link href="/contact">página de contato</Link>.
      </p>
    </DocPage>
  );
}
