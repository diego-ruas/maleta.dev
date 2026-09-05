// Paths que servem markdown via Accept (acceptmarkdown.com).
// A negociação em si é feita pelas `routes` do vercel.json — elas rodam antes
// da checagem de filesystem, ao contrário de `rewrites`. Este mapa existe para
// o teste conferir que todo path negociado tem um .md correspondente em public/.
export const MARKDOWN_PATHS: Record<string, string> = {
  "/": "/index.md",
  "/about": "/about.md",
  "/contact": "/contact.md",
  "/privacy": "/privacy.md",
};
