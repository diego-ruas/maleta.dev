"use client";

import type { KeyboardEvent } from "react";

export interface DisplaySkill {
  name: string;
  category: string;
  description: string;
}

interface SkillCardProps {
  skill: DisplaySkill;
  selecting: boolean;
  selected: boolean;
  tipOpen: boolean;
  onToggleSelect: () => void;
  onToggleTip: () => void;
}

export default function SkillCard({
  skill,
  selecting,
  selected,
  tipOpen,
  onToggleSelect,
  onToggleTip,
}: SkillCardProps) {
  const descId = `sd-${skill.name}`;

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (selecting) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggleTip();
    }
  }

  return (
    <div
      className={[
        "skill-card",
        selecting && selected ? "selected" : "",
        !selecting && tipOpen ? "tip-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role={selecting ? undefined : "button"}
      tabIndex={selecting ? -1 : 0}
      data-category={skill.category}
      data-desc={skill.description}
      aria-describedby={descId}
      onClick={selecting ? onToggleSelect : onToggleTip}
      onKeyDown={handleKeyDown}
    >
      {selecting && (
        <input
          type="checkbox"
          className="skill-check"
          aria-label={`Selecionar ${skill.name}`}
          checked={selected}
          onChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      {skill.name}
      <span className="visually-hidden" id={descId}>
        : {skill.description}
      </span>
    </div>
  );
}
