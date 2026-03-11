import type { Metadata } from "next";
import { ConsoleEasterEgg } from "@/components/ConsoleEasterEgg";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joosep Serva — AI Engineer & Software Developer",
  description:
    "Applied AI Engineer based in Tallinn, Estonia. Building intelligent systems with AWS, Python, LangChain, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConsoleEasterEgg />
        {children}
      </body>
    </html>
  );
}
