"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface OpencodeIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface OpencodeIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const OPENCODE_VARIANTS: Variants = {
  normal: { scale: 1 },
  animate: {
    scale: [1, 1.15, 1],
    transition: {
      duration: 0.3,
      ease: "linear",
    },
  },
};

const OpencodeIcon = forwardRef<OpencodeIconHandle, OpencodeIconProps>(
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
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
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
        <svg
          fill="currentColor"
          height={size}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.g animate={controls} variants={OPENCODE_VARIANTS}>
            <path d="M16 6H8v12h8V6zm4 16H4V2h16v20z" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

OpencodeIcon.displayName = "OpencodeIcon";

export { OpencodeIcon };
