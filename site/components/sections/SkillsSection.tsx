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
        Escolha um preset de partida, ajuste as skills desejadas para o seu fluxo e importe pacotes da comunidade pelo Hub.
      </p>
      <SkillsExplorer categories={CATEGORIES} />
    </Reveal>
  );
}
