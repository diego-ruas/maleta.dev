"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import ToastIcon, { type ToastVariant } from "@/components/icons/ToastIcon";

type ShowToast = (message: string, variant?: ToastVariant) => void;

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

const ToastContext = createContext<ShowToast | null>(null);

export function useToast(): ShowToast {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback<ShowToast>((msg, variant = "check") => {
    const id = ++idRef.current;
    setQueue((q) => [...q, { id, message: msg, variant }]);
    setTimeout(() => setQueue((q) => q.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {/* role/aria-live ficam no container persistente: criado dinamicamente
          dentro do AnimatePresence, um leitor de tela pode nao notar a
          regiao a tempo de anunciar o primeiro toast. */}
      <div className="toast-stack" role="status" aria-live="polite">
        <AnimatePresence>
          {queue.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="toast"
            >
              <ToastIcon variant={t.variant} />
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
