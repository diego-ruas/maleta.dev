import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "../css/base.css";
import "../css/site.css";
import "../css/transitions.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maleta.dev"),
  title: "Maleta.dev — baixe e instale skills, plugins e configs de IA",
  description:
    "Coleção curada e instalável de skills, plugins e configurações de IA para Claude Code e opencode. Clone, rode o instalador e pronto.",
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
    title: "Maleta.dev — baixe e instale skills, plugins e configs de IA",
    description:
      "Coleção curada e instalável de skills, plugins e configurações de IA para Claude Code e opencode.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maleta.dev — baixe e instale skills, plugins e configs de IA",
    description:
      "Coleção curada e instalável de skills, plugins e configurações de IA para Claude Code e opencode.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
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
      </body>
    </html>
  );
}