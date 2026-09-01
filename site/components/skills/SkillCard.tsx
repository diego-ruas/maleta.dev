"use client";

import AnimatedIcon from "@/components/AnimatedIcon";
import { CheckIcon } from "@/components/icons/check";
import { getCategoryIcon } from "@/lib/iconMap";

export interface DisplaySkill {
  name: string;
  category: string;
  description: string;
}

interface SkillCardProps {
  skill: DisplaySkill;
  selected: boolean;
  onToggleSelect: () => void;
}

export default function SkillCard({
  skill,
  selected,
  onToggleSelect,
}: SkillCardProps) {
  const CategoryIcon = getCategoryIcon(skill.category);

  return (
    <li className={`skill-row-item${selected ? " selected" : ""}`}>
      {/* A linha inteira e clicavel (nao so o botao) para casar com a
          affordance visual e aumentar a area de toque no mobile. */}
      <button
        type="button"
        className="skill-row-main"
        onClick={onToggleSelect}
        aria-pressed={selected}
      >
        <span className="skill-row-icon-cell">
          <AnimatedIcon Icon={CategoryIcon} className="skill-item-icon" size={20} />
        </span>
        <span className="skill-row-info">
          <span className="skill-row-title-row">
            <span className="skill-row-name">{skill.name}</span>
            <span className="skill-row-category-chip">
              {skill.category}
            </span>
          </span>

          <span className="skill-row-desc">{skill.description}</span>
        </span>

        <span className={`btn-gh skill-row-select-btn skill-row-actions-cell${selected ? " active" : ""}`}>
          {selected ? (
            <>
              <span>Selecionada</span>
              <AnimatedIcon Icon={CheckIcon} className="icon icon-check-small" size={14} />
            </>
          ) : (
            <span>+ Selecionar</span>
          )}
        </span>
      </button>
    </li>
  );
}
