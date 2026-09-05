import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (p) => readFile(new URL(`../${p}`, import.meta.url), "utf8");

const TRUST_PAGES = ["about", "contact", "privacy"];

test("markdown mirrors exist for every negotiated path", async () => {
  const { MARKDOWN_PATHS } = await import("../lib/acceptNegotiation.ts");
  assert.deepEqual(Object.keys(MARKDOWN_PATHS), ["/", ...TRUST_PAGES.map((p) => `/${p}`)]);

  for (const target of Object.values(MARKDOWN_PATHS)) {
    const body = await read(`public${target}`);
    assert.match(body, /^# /m, `${target} must be markdown with a heading`);
  }
});

test("markdown negotiation uses routes, which run before the filesystem", async () => {
  // `rewrites` nunca dispara nestes paths: o filesystem tem precedência sobre
  // eles, então / sempre resolveria index.html. `routes` roda antes.
  // Middleware não é opção: incompatível com output: 'export'.
  const vercel = JSON.parse(await read("vercel.json"));
  assert.equal(vercel.rewrites, undefined, "accept rewrites never fire; use routes");

  const { MARKDOWN_PATHS } = await import("../lib/acceptNegotiation.ts");
  const negotiated = vercel.routes.filter((r) =>
    r.has?.some((h) => h.type === "header" && h.key === "accept" && /text\/markdown/.test(h.value)),
  );
  assert.equal(negotiated.length, 2, "expected / and the trust pages to negotiate markdown");

  for (const route of negotiated) {
    assert.equal(route.headers["Content-Type"], "text/markdown; charset=utf-8");
    assert.match(route.headers.Vary, /\bAccept\b/, `${route.src} is missing Vary: Accept`);
  }

  // Todo path negociado tem uma rota que o cobre.
  const srcs = negotiated.map((r) => r.src);
  for (const path of Object.keys(MARKDOWN_PATHS)) {
    const covered = srcs.some((s) => new RegExp(`^${s}$`).test(path));
    assert.ok(covered, `no route matches ${path}`);
  }
});

test("negotiated paths and .md files send Vary: Accept", async () => {
  const { headers } = JSON.parse(await read("vercel.json"));
  const varyFor = (source) =>
    headers
      .find((h) => h.source === source)
      ?.headers.find((h) => h.key.toLowerCase() === "vary")?.value;

  // acceptmarkdown.com: sem Vary: Accept a CDN serve a variante errada.
  for (const source of ["/", "/:page(about|contact|privacy)", "/:file(index|about|contact|privacy).md"]) {
    assert.match(varyFor(source) ?? "", /\bAccept\b/, `${source} is missing Vary: Accept`);
  }

  const md = headers.find((h) => h.source === "/:file(index|about|contact|privacy).md").headers;
  assert.equal(
    md.find((h) => h.key === "Content-Type")?.value,
    "text/markdown; charset=utf-8",
  );
});

test("404 body points agents at recovery routes", async () => {
  const notFound = await read("app/not-found.tsx");
  for (const path of ["/llms.txt", "/sitemap.xml", ...TRUST_PAGES.map((p) => `/${p}`)]) {
    assert.ok(notFound.includes(path), `404 markdown body is missing ${path}`);
  }
});

test("JSON-LD carries Organization contactPoint and address", async () => {
  const { SITE_JSON_LD } = await import("../lib/siteMeta.ts");
  const byType = (t) => SITE_JSON_LD["@graph"].find((n) => n["@type"] === t);

  const org = byType("Organization");
  assert.ok(org, "Organization node missing");
  assert.equal(org.address["@type"], "PostalAddress");
  assert.ok(org.address.addressCountry);
  assert.ok(org.contactPoint[0].email, "contactPoint needs an email");
  assert.ok(org.contactPoint[0].contactType);

  const app = byType("SoftwareApplication");
  assert.ok(app.offers && app.name && app.url && app.description);
  assert.equal(SITE_JSON_LD["@context"], "https://schema.org");
});

test("homepage declares all four metadata signals", async () => {
  const layout = await read("app/layout.tsx");
  assert.match(layout, /canonical:/, "missing rel=canonical");
  assert.match(layout, /<html lang="pt-BR"/, "missing html lang");
  assert.match(layout, /type: "website"/, "missing og:type");

  // og:image vem do arquivo de convencao app/opengraph-image.tsx.
  const og = await read("app/opengraph-image.tsx");
  assert.match(og, /size = \{ width: 1200, height: 630 \}/);
});

test("sitemap lists every trust page", async () => {
  const sitemap = await read("public/sitemap.xml");
  for (const page of TRUST_PAGES) {
    assert.ok(sitemap.includes(`https://maleta.dev/${page}`), `sitemap missing /${page}`);
  }
});

test("llms.txt has when-to-use guidance and named developer resources", async () => {
  const llms = await read("public/llms.txt");
  assert.match(llms, /## When to Use This/);
  assert.match(llms, /## Developer Resources/);
  assert.match(llms, /install\.ps1/);
  assert.match(llms, /sitemap\.xml/);
});

test("trust pages carry enough content to read as real pages", async () => {
  for (const page of TRUST_PAGES) {
    const md = await read(`public/${page}.md`);
    assert.ok(md.length >= 500, `${page}.md under 500 chars`);

    const tsx = await read(`app/${page}/page.tsx`);
    const prose = [...tsx.matchAll(/<p>([\s\S]*?)<\/p>/g)].join("");
    assert.ok(prose.length >= 500, `/${page} page has under 500 chars of prose`);
    assert.match(tsx, /alternates: \{ canonical: "\/\w+" \}/, `/${page} missing canonical`);
  }
});
