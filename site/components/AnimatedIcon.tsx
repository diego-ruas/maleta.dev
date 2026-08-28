"use client";

import type { ComponentType, HTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";

interface IconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

interface AnimatedIconProps extends IconProps {
  Icon: ComponentType<IconProps & { ref?: React.Ref<IconHandle> }>;
}

export default function AnimatedIcon({ Icon, className, size }: AnimatedIconProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<IconHandle>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const host = hostRef.current?.parentElement;
    if (!host) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;
    const enter = () => apiRef.current?.startAnimation();
    const leave = () => apiRef.current?.stopAnimation();
    host.addEventListener("mouseenter", enter);
    host.addEventListener("mouseleave", leave);
    return () => {
      host.removeEventListener("mouseenter", enter);
      host.removeEventListener("mouseleave", leave);
    };
  }, [ready]);

  return (
    <div ref={hostRef} className="ai-host" aria-hidden="true">
      <Icon ref={apiRef} className={className} size={size} />
    </div>
  );
}
