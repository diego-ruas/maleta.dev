import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ToastProvider } from "@/components/Toast";
import "../css/base.css";
import "../css/site.css";
import "../css/transitions.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maleta.dev"),
  title: "Maleta.dev | AI Toolkit",
  description:
    "Coleção curada e instalável de skills, plugins e configurações de IA para Claude Code e Codex. 100% local, seguro e pronto em 1 comando.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://maleta.dev",
    siteName: "Maleta.dev",
    title: "Maleta.dev | AI Toolkit",
    description:
      "Coleção curada e instalável de skills, plugins e configurações de IA para Claude Code e Codex. 100% local e configurado em segundos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maleta.dev | AI Toolkit",
    description:
      "Coleção curada e instalável de skills, plugins e configurações de IA para Claude Code e Codex. 100% local e configurado em segundos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={jetbrainsMono.variable}>
      <body>
        <ToastProvider>{children}</ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}