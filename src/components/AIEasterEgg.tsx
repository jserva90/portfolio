"use client";

import { useState, useEffect, useCallback } from "react";

const BUZZWORDS = [
  "Synergizing neural paradigms for enterprise-grade thought leadership",
  "Disrupting disruption with AI-powered AI that uses AI",
  "Our proprietary LLM wrapper adds a button to ChatGPT",
  "We're not just building AI — we're reimagining the reimagining of intelligence",
  "Blockchain-adjacent, metaverse-ready, quantum-inspired vibes",
];

const FEATURES = [
  { title: "10x Engineer Replacement", desc: "Why hire humans when you can hallucinate?" },
  { title: "Prompt-Driven Architecture", desc: "We replaced our CTO with a system prompt" },
  { title: "Series A Ready", desc: "No revenue, no users, $40M valuation" },
  { title: "Powered by Vibes", desc: "Our entire backend was built in a weekend" },
];

export function AIEasterEgg() {
  const [triggered, setTriggered] = useState(false);
  const [buffer, setBuffer] = useState("");

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (triggered) return;
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const next = (buffer + e.key.toLowerCase()).slice(-2);
      setBuffer(next);

      if (next === "ai") {
        setTriggered(true);
        setTimeout(() => setTriggered(false), 5000);
        setBuffer("");
      }
    },
    [buffer, triggered]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!triggered) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white transition-opacity duration-300"
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      {/* Gradient blob */}
      <div
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4)" }}
      />

      <div className="relative z-10 max-w-2xl px-6 text-center">
        <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
          Stealth Mode
        </div>

        <h1 className="mb-4 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-5xl font-extrabold text-transparent">
          ThoughtLeaderAI
        </h1>

        <p className="mb-8 text-xl text-gray-500">
          {BUZZWORDS[Math.floor(Math.random() * BUZZWORDS.length)]}
        </p>

        <div className="mb-10 grid grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-left">
              <p className="text-sm font-bold text-gray-800">{f.title}</p>
              <p className="text-xs text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>

        <button className="rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white">
          Request Demo (We Don&apos;t Have One)
        </button>
      </div>

      {/* Snap back message */}
      <p
        className="absolute bottom-8 text-sm font-semibold text-gray-400"
        style={{ animation: "fadeIn 1s ease-out 3s both" }}
      >
        Just kidding. Engineering over hype.
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
