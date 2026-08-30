import Reveal from "@/components/Reveal";
import SkillsExplorer from "@/components/skills/SkillsExplorer";
import { CATEGORIES, SKILLS } from "@/lib/data";

export default function SkillsSection() {
  return (
    <Reveal id="skills" className="reveal" ariaLabelledby="skills-heading">
      <div className="section-header-badge">
        <span className="section-tag-prefix">{"// 03. SKILLS & PRESETS"}</span>
      </div>
      <h2 id="skills-heading">Skills & Presets</h2>
      <p className="section-glossary">
        {"// Skill = um arquivo SKILL.md com instruções que o agente carrega quando o assunto aparece."}
      </p>
      <p>
        Monte seu pacote, ajuste as {SKILLS.length} skills quando quiser e copie o comando pronto.
      </p>
      <SkillsExplorer categories={CATEGORIES} />
    </Reveal>
  );
}
