import Link from "next/link";
import SiteHeader from "@/components/sections/SiteHeader";

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
      </div>
    </>
  );
}
