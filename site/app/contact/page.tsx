import type { Metadata } from "next";
import Link from "next/link";
import DocPage from "@/components/sections/DocPage";
import { CONTACT_EMAIL, REPO_URL } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: "Contato | Maleta.dev",
  description:
    "Como falar com quem mantém o Maleta.dev: relatar bugs, sugerir skills, reportar vulnerabilidades ou tirar dúvidas de instalação.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <DocPage
      title="Contato"
      lead="Bugs, sugestões de skills, problemas de instalação ou questões de segurança — por onde falar com o projeto."
    >
      <h2>Bugs e sugestões de skills</h2>
      <p>
        O canal principal é o rastreador de issues do repositório:{" "}
        <a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer">
          github.com/diego-ruas/maleta.dev/issues
        </a>
        . Use-o para relatar falhas de instalação, skills desatualizadas, links quebrados no catálogo
        ou para propor a inclusão de uma nova skill. Ao abrir uma issue de instalação, informe o
        sistema operacional, a versão do assistente (Claude Code ou Codex) e o comando exato que foi
        executado — isso costuma bastar para reproduzir o problema na primeira tentativa.
      </p>

      <h2>Contribuições de código</h2>
      <p>
        Pull requests são bem-vindos no mesmo repositório. Skills de terceiros incluídas no catálogo
        são cópias fiéis dos artefatos originais e não são editadas localmente: correções nelas devem
        ser enviadas ao projeto de origem, e o Maleta.dev sincroniza a versão atualizada depois.
        Mudanças no site e nos scripts de instalação, por outro lado, podem ser propostas diretamente.
      </p>

      <h2>Email</h2>
      <p>
        Para assuntos que não cabem em uma issue pública — questões de licenciamento, remoção de
        conteúdo, imprensa ou uma dúvida que envolva dados sensíveis — escreva para{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. O projeto é mantido por uma pessoa,
        em português e inglês, então a resposta pode levar alguns dias.
      </p>

      <h2>Segurança</h2>
      <p>
        Se você encontrar uma vulnerabilidade nos scripts de instalação ou no site, não abra uma issue
        pública. Escreva para <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> com os detalhes
        e um passo a passo de reprodução. Os scripts rodam com as permissões do usuário e escrevem em
        diretórios de configuração locais, então relatos nessa área são tratados com prioridade.
      </p>

      <h2>Para agentes</h2>
      <p>
        Agentes automatizados que precisam descrever ou recomendar o projeto devem ler{" "}
        <a href="/llms.txt">/llms.txt</a>, que traz os comandos de instalação canônicos e os casos de
        uso adequados. Veja também <Link href="/about">a página Sobre</Link> para contexto do projeto.
      </p>
    </DocPage>
  );
}
