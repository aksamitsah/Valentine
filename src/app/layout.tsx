import type { Metadata, Viewport } from "next";
import { Inter, Great_Vibes, Dancing_Script, Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1a0a1a' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  title: "Be My Valentine 💕",
  description: "Create a special Valentine's proposal link for your loved one",
  keywords: ["valentine", "love", "proposal", "romantic"],
  icons: {
    icon: "/icon.svg?v=2",
    apple: "/icon.svg?v=2",
    shortcut: "/icon.svg?v=2",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Be My Valentine',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#1a0a1a" media="(prefers-color-scheme: light)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.variable} ${greatVibes.variable} ${dancingScript.variable} ${poppins.variable} antialiased bg-[#0a0a0a]`}>
        <AuthProvider>
          <div className="hearts-bg" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
