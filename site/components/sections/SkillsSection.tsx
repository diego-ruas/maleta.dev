import Reveal from "@/components/Reveal";
import SkillsExplorer from "@/components/skills/SkillsExplorer";
import { SKILLS, CATEGORIES } from "@/lib/data";

export default function SkillsSection() {
  return (
    <Reveal id="skills" className="reveal" ariaLabelledby="skills-heading">
      <h2 id="skills-heading">Skills & Presets</h2>
      <p>
        Escolha um preset pronto para o seu perfil (Essenciais, Frontend, Acessibilidade, Next.js, Testes, etc.) ou use o{" "}
        <a href="#repo-add"><strong>Hub Comunitário</strong></a> abaixo para pesquisar e puxar novas skills diretamente do GitHub em tempo real.
      </p>
      <SkillsExplorer skills={SKILLS} categories={CATEGORIES} />
    </Reveal>
  );
}
