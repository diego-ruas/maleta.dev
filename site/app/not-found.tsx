import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "4rem 2rem", textAlign: "center", fontFamily: "var(--font-mono)" }}>
      <h1 style={{ fontSize: "2rem", color: "var(--color-accent)", marginBottom: "1rem" }}>404 — Página não encontrada</h1>
      <p style={{ color: "var(--fg-muted)", marginBottom: "2rem" }}>A página que você está procurando não existe.</p>
      <Link href="/" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>
        Voltar para a página inicial
      </Link>
    </div>
  );
}
