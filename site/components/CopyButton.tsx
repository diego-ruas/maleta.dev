"use client";

import { useState } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useToast } from "@/components/Toast";

function fallbackCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "absolute";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
}

interface CopyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children"> {
  text: string;
  toastMessage?: string;
  children: ReactNode;
}

export default function CopyButton({
  text,
  toastMessage = "Comando copiado!",
  className,
  children,
  ...rest
}: CopyButtonProps) {
  const showToast = useToast();
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
    } catch {
      showToast("Não foi possível copiar", "warning");
      return;
    }
    showToast(toastMessage, "clipboard");
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
