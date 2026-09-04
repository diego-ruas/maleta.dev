import SiteHeader from "@/components/sections/SiteHeader";
import SiteFooter from "@/components/sections/SiteFooter";

interface DocPageProps {
  title: string;
  lead: string;
  children: React.ReactNode;
}

export default function DocPage({ title, lead, children }: DocPageProps) {
  return (
    <>
      <a href="#main" className="skip-link">
        Ir para o conteúdo
      </a>

      <SiteHeader />

      <main id="main">
        <section className="doc-page">
          <h1 className="doc-title">{title}</h1>
          <p className="doc-lead">{lead}</p>
          <div className="doc-body">{children}</div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
