import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/Toast";
import "../css/base.css";
import "../css/site.css";
import "../css/transitions.css";

const departureMono = localFont({
  src: "./fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maleta.dev"),
  title: "Maleta.dev — Skills, plugins e configurações para Claude Code e opencode",
  description:
    "Coleção curada e instalável de skills, plugins e configurações de IA para Claude Code e opencode. 100% local, seguro e pronto em 1 comando.",
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
    title: "Maleta.dev — Skills, plugins e configs de IA prontas para instalar",
    description:
      "Coleção curada e instalável de skills, plugins e configurações de IA para Claude Code e opencode. 100% local e configurado em segundos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maleta.dev — Skills, plugins e configs de IA prontas para instalar",
    description:
      "Coleção curada e instalável de skills, plugins e configurações de IA para Claude Code e opencode. 100% local e configurado em segundos.",
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
    <html lang="pt-BR" className={departureMono.variable}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}