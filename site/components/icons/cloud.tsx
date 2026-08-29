"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface CloudIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CloudIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CLOUD_VARIANTS: Variants = {
  normal: { scale: 1, y: 0 },
  animate: {
    scale: [1, 1.08, 1],
    y: [0, -2, 0],
    transition: {
      duration: 0.3,
      ease: "linear",
    },
  },
};

const CloudIcon = forwardRef<CloudIconHandle, CloudIconProps>(
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
          <motion.g animate={controls} variants={CLOUD_VARIANTS}>
            <path d="M22 10h-4v2h4v-2Zm2 2h-2v6h2v-6Zm-2 6H2v2h20v-2ZM2 12H0v6h2v-6Zm2-2H2v2h2v-2Zm4-2H4v2h4V8Zm8-4h-6v2h6V4Zm-6 2H8v2h2V6Zm0 4H8v2h2v-2Zm8-4h-2v2h2V6Z" />
            <path d="M20 8h-2v4h2V8Zm-2 4h-2v2h2v-2Z" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

CloudIcon.displayName = "CloudIcon";

export { CloudIcon };
