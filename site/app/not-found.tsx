import Link from "next/link";
import SiteHeader from "@/components/sections/SiteHeader";

// Corpo em markdown para agentes se recuperarem de uma URL errada: o texto
// dentro do <pre> e legivel como markdown quando a pagina e convertida.
const RECOVERY_MARKDOWN = `# 404 — Not Found

This path does not exist on maleta.dev.

## Where to look next

- [/](https://maleta.dev/) — home, catalog and custom install builder
- [/llms.txt](https://maleta.dev/llms.txt) — agent instructions, when to use, install commands
- [/sitemap.xml](https://maleta.dev/sitemap.xml) — every canonical URL
- [/about](https://maleta.dev/about) — what the project is
- [/contact](https://maleta.dev/contact) — how to reach the maintainer
- [/privacy](https://maleta.dev/privacy) — data handling
- [/install.sh](https://maleta.dev/install.sh) and [/install.ps1](https://maleta.dev/install.ps1) — installers
`;

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <div className="not-found">
        <h1 className="not-found-title">404 — Página não encontrada</h1>
        <p className="not-found-desc">A página que você está procurando não existe.</p>
        <Link href="/" className="btn-primary">
          Voltar para a página inicial
        </Link>
        <pre className="not-found-map">{RECOVERY_MARKDOWN}</pre>
      </div>
    </>
  );
}
