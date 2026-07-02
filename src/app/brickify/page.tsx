import type { Metadata } from "next";
import { Brickifier } from "@/components/Brickifier";

export const metadata: Metadata = {
  title: "The Brickifier — Joosep Serva",
  description:
    "Turn any picture into a LEGO mosaic or 3D brick relief — entirely in your browser.",
};

export default function BrickifyPage() {
  return (
    <div className="min-h-screen bg-lego-black">
      <nav className="fixed left-0 right-0 top-0 z-50 bg-lego-black/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a
            href="/"
            className="text-sm font-medium text-lego-gray transition-colors hover:text-white"
          >
            ← Back to portfolio
          </a>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-full bg-lego-red" />
            <div className="h-3 w-3 rounded-full bg-lego-yellow" />
            <div className="h-3 w-3 rounded-full bg-lego-blue" />
            <div className="h-3 w-3 rounded-full bg-lego-green" />
          </div>
        </div>
      </nav>
      <Brickifier />
    </div>
  );
}
