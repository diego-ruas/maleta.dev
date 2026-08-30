"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";
import { CODEX_ICON_PATH } from "@/lib/codexIconPath";

export interface CodexIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CodexIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CODEX_VARIANTS: Variants = {
  normal: { scale: 1, rotate: 0 },
  animate: {
    scale: [1, 1.12, 1],
    rotate: [0, -4, 4, 0],
    transition: { duration: 0.3, ease: "linear" },
  },
};

const CodexIcon = forwardRef<CodexIconHandle, CodexIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 20, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) onMouseEnter?.(event);
        else controls.start("animate");
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) onMouseLeave?.(event);
        else controls.start("normal");
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn("inline-flex items-center justify-center", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg fill="currentColor" height={size} viewBox="0 0 24 24" width={size} xmlns="http://www.w3.org/2000/svg">
          <motion.g animate={controls} variants={CODEX_VARIANTS}>
            <path d={CODEX_ICON_PATH} />
          </motion.g>
        </svg>
      </div>
    );
  }
);

CodexIcon.displayName = "CodexIcon";

export { CodexIcon };
