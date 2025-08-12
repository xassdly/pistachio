import type { Metadata } from "next";
import "./globals.css";
import { Itim } from 'next/font/google';
import { NextAuthProvider } from "./components/Providers";

const itim = Itim({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Pistachio",
  description: "AI-chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
