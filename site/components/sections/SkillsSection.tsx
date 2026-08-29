import Reveal from "@/components/Reveal";
import SkillsExplorer from "@/components/skills/SkillsExplorer";
import { CATEGORIES } from "@/lib/data";

export default function SkillsSection() {
  return (
    <Reveal id="skills" className="reveal" ariaLabelledby="skills-heading">
      <div className="section-header-badge">
        <span className="section-tag-prefix">{"// 03. SKILLS & PRESETS"}</span>
      </div>
      <h2 id="skills-heading">Skills & Presets</h2>
      <p>
        Personalização em 4 etapas: escolha uma base recomendada, refine as 83 skills por categoria, importe repositórios abertos do GitHub e copie seu comando PowerShell pronto.
      </p>
      <SkillsExplorer categories={CATEGORIES} />
    </Reveal>
  );
}
