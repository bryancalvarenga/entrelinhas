import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Entrelinhas - Uma rede social mais humana",
  description:
    "Um espaço calmo para pensamentos autênticos, reflexões e conexões genuínas. Sem métricas de popularidade, sem comparação.",
  generator: "v0.app",
  keywords: [
    "rede social",
    "bem-estar digital",
    "journaling",
    "diário digital",
    "reflexão",
  ],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f3f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning evita erro de hydration quando o script
    // adiciona class="dark" no cliente antes que o React hidrate.
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${sourceSerif.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {/* Aplica dark mode antes do React para evitar flash branco */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('entrelinhas_dark_mode')==='true'){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
