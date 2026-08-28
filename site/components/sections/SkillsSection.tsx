import Reveal from "@/components/Reveal";
import SkillsExplorer from "@/components/skills/SkillsExplorer";
import { SKILLS, CATEGORIES } from "@/lib/data";

export default function SkillsSection() {
  return (
    <Reveal id="skills" className="reveal" ariaLabelledby="skills-heading">
      <h2 id="skills-heading">Skills ({SKILLS.length})</h2>
      <p>
        Todas as skills que o <code>claude/install.ps1</code> instala em{" "}
        <code>~/.claude/skills/</code>. Já vêm todas marcadas — desmarque o
        que não quiser e leve só a sua seleção. Passe o mouse para ver o que
        cada uma faz, ou use <strong>Ver descrições</strong> para desligar a
        seleção e abrir as descrições no toque.
      </p>
      <SkillsExplorer skills={SKILLS} categories={CATEGORIES} />
    </Reveal>
  );
}
