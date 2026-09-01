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
      <div className="skill-row-main">
        <div className="skill-row-icon-cell">
          <AnimatedIcon Icon={CategoryIcon} className="skill-item-icon" size={20} />
        </div>
        <div className="skill-row-info">
          <div className="skill-row-title-row">
            <span className="skill-row-name">{skill.name}</span>
            <span className="skill-row-category-chip">
              {skill.category}
            </span>
          </div>

          <p className="skill-row-desc">{skill.description}</p>
        </div>

        <div className="skill-row-actions-cell">
          <button
            type="button"
            className={`btn-gh skill-row-select-btn${selected ? " active" : ""}`}
            onClick={onToggleSelect}
            aria-pressed={selected}
          >
            {selected ? (
              <>
                <span>Selecionada</span>
                <AnimatedIcon Icon={CheckIcon} className="icon icon-check-small" size={14} />
              </>
            ) : (
              <span>+ Selecionar</span>
            )}
          </button>
        </div>
      </div>
    </li>
  );
}
