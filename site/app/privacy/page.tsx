import type { Metadata } from "next";
import Link from "next/link";
import DocPage from "@/components/sections/DocPage";
import { CONTACT_EMAIL } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: "Privacidade | Maleta.dev",
  description:
    "Quais dados o site e os scripts de instalação do Maleta.dev coletam, o que nunca sai da sua máquina e como exercer seus direitos.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <DocPage
      title="Política de privacidade"
      lead="O que sai da sua máquina, o que nunca sai, e por quê. Última atualização: setembro de 2026."
    >
      <h2>Os scripts de instalação não coletam nada</h2>
      <p>
        Os scripts <code>install.ps1</code> e <code>install.sh</code> são de mão única: eles baixam
        arquivos e os gravam nos diretórios de configuração locais do Claude Code e do Codex. Nenhuma
        informação é enviada de volta ao Maleta.dev. Não há telemetria, não há identificador de
        instalação, não há relatório de uso. Os scripts não leem chaves de API, não leem históricos de
        sessão e não fazem upload de qualquer arquivo do seu disco. Antes de sobrescrever uma
        configuração existente, é criado um backup local com a extensão <code>.pre-install.bak</code>.
      </p>

      <h2>O que o site coleta</h2>
      <p>
        O site usa o Vercel Analytics para medir volume de acesso e páginas mais visitadas. É uma
        medição agregada e sem cookies: não há perfil individual, não há rastreamento entre sites e o
        endereço IP não é armazenado em forma bruta pelo produto. As seleções que você faz no
        construtor de comandos — presets, skills marcadas, importações da comunidade — são
        processadas no seu navegador e nunca são enviadas a um servidor nosso; o comando gerado
        existe apenas na página aberta.
      </p>

      <h2>Serviços de terceiros</h2>
      <p>
        A busca de skills da comunidade consulta a API pública do GitHub diretamente do seu
        navegador. Nessas requisições, o GitHub recebe seu endereço IP e o cabeçalho de user agent,
        como em qualquer visita a um site — o tratamento desses dados segue a política de privacidade
        do GitHub, não a nossa. Os scripts de instalação também baixam arquivos de{" "}
        <code>raw.githubusercontent.com</code>. Nenhum outro serviço de terceiros recebe dados seus a
        partir deste site.
      </p>

      <h2>Cookies</h2>
      <p>
        O site não define cookies de rastreamento nem de publicidade. Preferências de interface,
        quando existem, ficam no armazenamento local do seu navegador e nunca são transmitidas.
      </p>

      <h2>Seus direitos e contato</h2>
      <p>
        Como não mantemos cadastro, conta ou base de dados pessoais, não há um perfil seu para
        acessar, corrigir ou excluir. Se ainda assim você tiver uma dúvida sobre tratamento de dados,
        quiser solicitar a remoção de algum conteúdo ou precisar de um esclarecimento formal, escreva
        para <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Outros canais estão na{" "}
        <Link href="/contact">página de contato</Link>.
      </p>
    </DocPage>
  );
}
