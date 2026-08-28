"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface SlidersHorizontalIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SlidersHorizontalIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SLIDERS_VARIANTS: Variants = {
  normal: { scale: 1, x: 0 },
  animate: {
    scale: [1, 1.1, 1.1, 1],
    x: [0, -1, 1, 0],
    transition: {
      duration: 0.3,
      ease: "linear",
    },
  },
};

const SlidersHorizontalIcon = forwardRef<
  SlidersHorizontalIconHandle,
  SlidersHorizontalIconProps
>(({ onMouseEnter, onMouseLeave, className, size = 20, ...props }, ref) => {
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
      className={cn(className)}
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
        <motion.g animate={controls} variants={SLIDERS_VARIANTS}>
          <path d="M17 18h5v2h-5v2h-2v-6h2v2Zm-4 2H2v-2h11v2Zm-4-5H7v-2H2v-2h5V9h2v6Zm13-2H11v-2h11v2Zm-7-9h7v2h-7v2h-2V2h2v2Zm-4 2H2V4h9v2Z" />
        </motion.g>
      </svg>
    </div>
  );
});

SlidersHorizontalIcon.displayName = "SlidersHorizontalIcon";

export { SlidersHorizontalIcon };
