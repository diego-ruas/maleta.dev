"use client";

import { useEffect, useState } from "react";

const GLYPHS = "01#_/[];><*$!%&?+~";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  className?: string;
}

export default function DecryptedText({
  text,
  speed = 35,
  maxIterations = 8,
  className,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / (maxIterations / 3);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, maxIterations]);

  return <span className={className}>{displayText}</span>;
}
