"use client";

import { useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useToast } from "@/components/Toast";

function fallbackCopy(text: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "absolute";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  return ok;
}

interface CopyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children"> {
  text: string;
  children: ReactNode;
}

export default function CopyButton({ text, className, children, ...rest }: CopyButtonProps) {
  const showToast = useToast();
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else if (!fallbackCopy(text)) {
        throw new Error("execCommand copy failed");
      }
    } catch {
      showToast("Não foi possível copiar", "warning");
      return;
    }
    // Feedback visual local (icone + classe .copied) + toast (anunciado por
    // leitores de tela via aria-live, o que o visual sozinho nao cobre).
    showToast("Copiado!", "check");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      className={copied ? `${className ?? ""} copied`.trim() : className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}
