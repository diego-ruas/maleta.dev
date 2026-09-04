import SiteHeader from "@/components/sections/SiteHeader";
import Hero from "@/components/sections/Hero";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import PluginsSection from "@/components/sections/PluginsSection";
import FaqSection from "@/components/sections/FaqSection";
import SiteFooter from "@/components/sections/SiteFooter";
import StickyProgress from "@/components/StickyProgress";
import { ToolkitProvider } from "@/lib/toolkitContext";

export default function Page() {
  return (
    <ToolkitProvider>
      <a href="#main" className="skip-link">
        Ir para o conteúdo
      </a>

      <SiteHeader />

      <main id="main">
        <Hero />
        <AboutSection />
        <SkillsSection />
        <PluginsSection />
        <FaqSection />
      </main>

      <SiteFooter />
      <StickyProgress />
    </ToolkitProvider>
  );
}
