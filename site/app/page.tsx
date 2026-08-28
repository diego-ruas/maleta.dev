import SiteHeader from "@/components/sections/SiteHeader";
import Hero from "@/components/sections/Hero";
import SecuritySection from "@/components/sections/SecuritySection";
import InstallSteps from "@/components/sections/InstallSteps";
import ToolsGrid from "@/components/sections/ToolsGrid";
import SkillsSection from "@/components/sections/SkillsSection";
import PluginsSection from "@/components/sections/PluginsSection";
import FaqSection from "@/components/sections/FaqSection";
import SiteFooter from "@/components/sections/SiteFooter";
import BackToTop from "@/components/BackToTop";

export default function Page() {
  return (
    <>
      <a href="#main" className="skip-link">
        Ir para o conteúdo
      </a>

      <SiteHeader />

      <main id="main">
        <Hero />
        <SecuritySection />
        <InstallSteps />
        <ToolsGrid />
        <SkillsSection />
        <PluginsSection />
        <FaqSection />
      </main>

      <SiteFooter />
      <BackToTop />
    </>
  );
}
