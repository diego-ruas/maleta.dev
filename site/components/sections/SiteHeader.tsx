import Link from "next/link";

export default function SiteHeader() {
  return (
    <header>
      <Link href="/" className="site-name" aria-current="page">
        <span>Maleta.dev</span>
      </Link>
      <nav aria-label="Navegação principal">
        <ul className="nav-links">
          <li>
            <a href="#seguranca">Segurança</a>
          </li>
          <li>
            <a href="#instalar">Instalar</a>
          </li>
          <li>
            <a href="#ferramentas">O que tem</a>
          </li>
          <li>
            <a href="#skills">Skills</a>
          </li>
          <li>
            <a href="#plugins">Plugins</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
