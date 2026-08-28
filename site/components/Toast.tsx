"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import ToastIcon, { type ToastVariant } from "@/components/icons/ToastIcon";

type ShowToast = (message: string, variant?: ToastVariant) => void;

const ToastContext = createContext<ShowToast | null>(null);

export function useToast(): ShowToast {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<ToastVariant>("check");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback<ShowToast>((msg, v = "check") => {
    clearTimeout(timerRef.current);
    setMessage(msg);
    setVariant(v);
    setVisible(false);
    requestAnimationFrame(() => {
      setVisible(true);
      timerRef.current = setTimeout(() => setVisible(false), 3000);
    });
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={visible ? "toast show" : "toast"} role="status" aria-live="polite">
        <ToastIcon variant={variant} />
        <span>{message}</span>
      </div>
    </ToastContext.Provider>
  );
}
