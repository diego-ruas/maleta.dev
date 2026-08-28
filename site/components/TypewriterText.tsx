"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
}

export default function TypewriterText({
  text,
  speed = 25,
  delay = 50,
  className,
  cursor = true,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setDisplayed(text);
      setComplete(true);
      return;
    }

    setDisplayed("");
    setComplete(false);

    let interval: ReturnType<typeof setInterval> | undefined;
    const startTimeout = setTimeout(() => {
      let index = 0;
      interval = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setComplete(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayed}
      {cursor && (
        <span className={`terminal-cursor${complete ? " blink" : ""}`} aria-hidden="true">
          █
        </span>
      )}
    </span>
  );
}
