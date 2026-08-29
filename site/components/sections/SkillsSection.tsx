import Reveal from "@/components/Reveal";
import SkillsExplorer from "@/components/skills/SkillsExplorer";
import { SKILLS, CATEGORIES } from "@/lib/data";

export default function SkillsSection() {
  return (
    <Reveal id="skills" className="reveal" ariaLabelledby="skills-heading">
      <h2 id="skills-heading">Skills & Presets</h2>
      <p>
        Escolha um preset recomendado para o seu perfil (Essenciais, Frontend, Acessibilidade, Next.js, Testes, etc.), explore o catálogo completo ou use o{" "}
        <a href="#repo-add"><strong>Hub Comunitário</strong></a> abaixo para pesquisar e importar novas skills diretamente do GitHub.
      </p>
      <SkillsExplorer skills={SKILLS} categories={CATEGORIES} />
    </Reveal>
  );
}
