import type { ReactNode } from "react";

export type ToastVariant = "check" | "clipboard" | "warning" | "download" | "plus";

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height={20}
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
          <path d="M8 6h12v2H8zM4 2h12v2H4zm2 6h2v12H6zM2 4h2v12H2zm6 16h12v2H8zM20 8h2v12h-2zm-4-4h2v2h-2zM4 16h2v2H4z" />
        </Svg>
      );
    case "warning":
      return (
        <Svg>
          <path d="M4 2h16v2H4zm0 18h16v2H4zM20 4h2v16h-2zM2 4h2v16H2zm9 2h2v8h-2zm0 10h2v2h-2z" />
        </Svg>
      );
    case "download":
      return (
        <Svg>
          <path d="M21 15v4h-2v-4zm-2 4v2H5v-2zM5 15v4H3v-4zm8-12v14h-2V3z" />
          <path d="M7 11v2h10v-2zm2 2v2h2v-2zm4 0v2h2v-2zm2-2v2h2v-2z" />
        </Svg>
      );
    case "plus":
      return (
        <Svg>
          <path d="M13 11h7v2h-7v7h-2v-7H4v-2h7V4h2v7Z" />
        </Svg>
      );
    case "check":
    default:
      return (
        <Svg>
          <path d="M10 18H8v-2h2v2Zm-2-2H6v-2h2v2Zm4-2v2h-2v-2h2Zm-6 0H4v-2h2v2Zm8 0h-2v-2h2v2Zm2-2h-2v-2h2v2Zm2-2h-2V8h2v2Zm2-2h-2V6h2v2Z" />
        </Svg>
      );
  }
}
