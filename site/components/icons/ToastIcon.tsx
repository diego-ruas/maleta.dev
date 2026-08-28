import type { ReactNode } from "react";

export type ToastVariant = "check" | "clipboard" | "warning" | "download" | "plus";

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={20}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width={20}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export default function ToastIcon({ variant }: { variant: ToastVariant }) {
  switch (variant) {
    case "clipboard":
      return (
        <Svg>
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <line x1="8" y1="11" x2="16" y2="11" />
          <line x1="8" y1="15" x2="14" y2="15" />
        </Svg>
      );
    case "warning":
      return (
        <Svg>
          <path d="M12 3 2 20h20L12 3Z" />
          <line x1="12" y1="10" x2="12" y2="14" />
          <line x1="12" y1="17" x2="12" y2="17" />
        </Svg>
      );
    case "download":
      return (
        <Svg>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </Svg>
      );
    case "plus":
      return (
        <Svg>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </Svg>
      );
    case "check":
    default:
      return (
        <Svg>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5 10.8 15.3 16 9" />
        </Svg>
      );
  }
}
