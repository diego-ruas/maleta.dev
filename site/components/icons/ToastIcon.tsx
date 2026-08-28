"use client";

import { CheckIcon } from "@/components/icons/check";
import { CopyIcon } from "@/components/icons/copy";
import { DownloadIcon } from "@/components/icons/download";
import { PlusIcon } from "@/components/icons/plus";
import { ShieldCheckIcon } from "@/components/icons/shield-check";

export type ToastVariant = "check" | "clipboard" | "warning" | "download" | "plus";

export default function ToastIcon({ variant }: { variant: ToastVariant }) {
  switch (variant) {
    case "clipboard":
      return <CopyIcon size={20} className="icon" />;
    case "warning":
      return <ShieldCheckIcon size={20} className="icon" />;
    case "download":
      return <DownloadIcon size={20} className="icon" />;
    case "plus":
      return <PlusIcon size={20} className="icon" />;
    case "check":
    default:
      return <CheckIcon size={20} className="icon" />;
  }
}
