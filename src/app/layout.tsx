import type { Metadata } from "next";
import { ConsoleEasterEgg } from "@/components/ConsoleEasterEgg";
import { TabTitle } from "@/components/TabTitle";
import { AIEasterEgg } from "@/components/AIEasterEgg";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CommandPalette } from "@/components/CommandPalette";
import { BuildMode } from "@/components/BuildMode";
import { Bricolage_Grotesque, Manrope, JetBrains_Mono } from "next/font/google";

import "./globals.css";

// Brand type system: Bricolage Grotesque (display — "bricolage" = building
// from the parts at hand), Manrope (body), JetBrains Mono (engineer accents).
const displayFont = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const sansFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joosep Serva — AI Engineer & Software Developer",
  description:
    "Applied AI Engineer based in Tallinn, Estonia. Building intelligent systems with AWS, Python, LangChain, and more.",
  verification: {
    google: "ZOkMfm-lItmlsaAoo-wEmc3p-qYI3Obru-k17cWA2JI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable} antialiased`}
      >
        <ConsoleEasterEgg />
        <TabTitle />
        <AIEasterEgg />
        <ScrollProgress />
        <CommandPalette />
        <BuildMode />
        {children}
      </body>
    </html>
  );
}
