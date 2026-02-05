import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Be My Valentine 💕",
  description: "Create a special Valentine's proposal link for your loved one",
  keywords: ["valentine", "love", "proposal", "romantic"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <div className="hearts-bg" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
