"use client";

import { useEffect, useState } from "react";

/**
 * Mode wrapper for /cv: the normal CV renders by default; a toggle flips
 * to LEGO building-instructions mode. Printing ALWAYS prints the normal
 * CV — the manual is screen-only (`no-print`), and the hidden normal CV
 * is restored for print via `print:block`.
 */
export function CvView({ cv }: { cv: React.ReactNode }) {
  const [manual, setManual] = useState(false);

  return (
    <>
      <button
        onClick={() => setManual((m) => !m)}
        className="no-print fixed bottom-6 right-6 z-50 rounded-sm bg-[#f5c400] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1a1a2e] shadow-lg transition-transform hover:scale-105"
      >
        {manual ? "📄 Back to normal CV" : "📘 View as building instructions"}
      </button>
      <div className={manual ? "hidden print:block" : ""}>{cv}</div>
      {manual && <ManualCv />}
    </>
  );
}

type Piece = { label: string; color: string; w: number };
type Step = {
  year: string;
  title: string;
  body: string;
  pieces: Piece[];
};

const RED = "#e3000b";
const YELLOW = "#f5c400";
const BLUE = "#006db7";
const GREEN = "#00852b";

const STEPS: Step[] = [
  {
    year: "2010",
    title: "Lay the foundation",
    body: "Start with a BSc in clinical psychology. It looks like a detour — it's actually the base plate: understanding how people think is half of every engineering job.",
    pieces: [{ label: "1× BSc Psychology", color: YELLOW, w: 4 }],
  },
  {
    year: "2019",
    title: "Attach the horn",
    body: "Add a BA in French horn and a chair in the Defense Force orchestra. Installs discipline, precision, and performing under pressure.",
    pieces: [{ label: "1× BA Horn", color: GREEN, w: 3 }, { label: "1× Orchestra chair", color: GREEN, w: 2 }],
  },
  {
    year: "2022",
    title: "Snap on the code",
    body: "kood/Jõhvi — no teachers, just projects. Complete the 2-year curriculum in under 8 months, top 5% of 500+ students.",
    pieces: [{ label: "1× kood/Jõhvi", color: BLUE, w: 4 }, { label: "1× Top 5%", color: YELLOW, w: 2 }],
  },
  {
    year: "2023",
    title: "First load-bearing wall",
    body: "LHV Bank, full stack: Java, Angular, Kubernetes. Business-critical treasury tooling where broken things are not tolerated.",
    pieces: [{ label: "1× LHV full stack", color: GREEN, w: 4 }],
  },
  {
    year: "2024",
    title: "A quick reinforcement",
    body: "Solutional consultancy — extreme programming and pair programming, properly practiced.",
    pieces: [{ label: "1× XP practice", color: YELLOW, w: 2 }],
  },
  {
    year: "2024",
    title: "Install the AI wing",
    body: "Back to LHV with an AI focus: the plug-and-play RAG platform, Kindlustusguru (Project of the Year), the Slack incident router, bank-wide SageMaker.",
    pieces: [{ label: "1× RAG platform", color: BLUE, w: 4 }, { label: "1× Project of the Year", color: RED, w: 2 }],
  },
  {
    year: "2025",
    title: "Top it off",
    body: "Avokaado, Applied AI Engineer: the whole document-to-agent pipeline — parsing, structure, variables, LangGraph orchestration.",
    pieces: [{ label: "1× AI pipeline", color: RED, w: 4 }, { label: "1× LangGraph agents", color: BLUE, w: 2 }],
  },
];

const SKILLS = [
  "Python", "TypeScript", "Java", "LangChain", "LangGraph", "RAG",
  "AWS", "SageMaker", "Terraform", "Kubernetes", "OpenSearch",
  "Spring Boot", "Angular", "React", "Docling", "Azure AI",
];

function Brick({ piece, dim }: { piece: Piece; dim?: boolean }) {
  return (
    <div
      className="flex h-8 items-center gap-2 rounded-[3px] px-2 transition-opacity"
      style={{
        width: piece.w * 44,
        background: piece.color,
        opacity: dim ? 0.45 : 1,
        boxShadow: dim ? "none" : "0 3px 8px rgba(0,0,0,0.35)",
      }}
    >
      {Array.from({ length: piece.w }).map((_, i) => (
        <span key={i} className="h-3 w-3 shrink-0 rounded-full bg-white/30" />
      ))}
    </div>
  );
}

/** The booklet itself: cover → numbered steps → parts inventory. */
function ManualCv() {
  const totalPages = STEPS.length + 2; // cover + steps + parts
  const [page, setPage] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setPage((p) => Math.min(p + 1, totalPages - 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(p - 1, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages]);

  const stepIndex = page - 1; // -1 = cover, STEPS.length = parts page
  const totalPieces = STEPS.reduce((a, s) => a + s.pieces.length, 0);

  return (
    <div className="no-print mx-auto max-w-[840px] px-6 pb-24 pt-24 text-[#1a1a2e]">
      <div className="relative min-h-[540px] rounded-md border-4 border-[#1a1a2e] bg-[#fffdf5] p-8 shadow-2xl md:p-12">
        {/* Cover */}
        {page === 0 && (
          <div className="flex min-h-[440px] flex-col items-center justify-center text-center">
            <div className="mb-6 flex gap-2">
              {[RED, YELLOW, BLUE, GREEN].map((c) => (
                <span key={c} className="h-5 w-10 rounded-[3px]" style={{ background: c }} />
              ))}
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#1a1a2e]/50">
              Building instructions
            </p>
            <h1 className="font-display mt-3 text-5xl font-extrabold">
              SET 1990
            </h1>
            <h2 className="font-display mt-1 text-3xl font-bold text-[#e3000b]">
              Joosep Serva
            </h2>
            <p className="mt-4 font-mono text-sm text-[#1a1a2e]/60">
              {totalPieces} pcs · ages 3+ · assembly time: ~15 years
            </p>
            <p className="mt-10 text-xs text-[#1a1a2e]/40">
              Use → arrow key or the buttons below to build
            </p>
          </div>
        )}

        {/* Steps */}
        {stepIndex >= 0 && stepIndex < STEPS.length && (
          <div className="grid min-h-[440px] gap-8 md:grid-cols-[1fr_280px]">
            <div>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-7xl font-extrabold text-[#1a1a2e]/15">
                  {stepIndex + 1}
                </span>
                <div>
                  <p className="font-mono text-xs text-[#1a1a2e]/50">{STEPS[stepIndex].year}</p>
                  <h2 className="font-display text-2xl font-bold">{STEPS[stepIndex].title}</h2>
                </div>
              </div>
              <p className="mt-4 max-w-md leading-relaxed text-[#1a1a2e]/70">
                {STEPS[stepIndex].body}
              </p>
              {/* New pieces callout */}
              <div className="mt-6 inline-block rounded-sm border-2 border-dashed border-[#1a1a2e]/30 p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#1a1a2e]/50">
                  New pieces in this step
                </p>
                <div className="space-y-2">
                  {STEPS[stepIndex].pieces.map((p) => (
                    <div key={p.label} className="flex items-center gap-3">
                      <Brick piece={p} />
                      <span className="text-xs font-semibold">{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* The growing build */}
            <div className="flex flex-col items-center justify-end">
              <div className="flex flex-col-reverse items-center gap-1">
                {STEPS.slice(0, stepIndex + 1).flatMap((s, si) =>
                  s.pieces.map((p) => (
                    <Brick key={`${si}-${p.label}`} piece={p} dim={si < stepIndex} />
                  )),
                )}
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[#1a1a2e]/40">
                The build so far
              </p>
            </div>
          </div>
        )}

        {/* Parts inventory */}
        {stepIndex === STEPS.length && (
          <div className="min-h-[440px]">
            <h2 className="font-display text-3xl font-bold">Parts inventory</h2>
            <p className="mt-2 text-sm text-[#1a1a2e]/60">
              Every piece used in this set.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <span
                  key={s}
                  className="rounded-sm bg-[#f2f2f0] px-3 py-1.5 font-mono text-xs font-semibold text-[#1a1a2e]/70"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-10 rounded-sm border-l-4 border-[#00852b] bg-[#f2f2f0] p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#1a1a2e]/50">
                Spare parts
              </p>
              <p className="mt-1 text-sm text-[#1a1a2e]/70">
                1× French horn (still plays) · 3× languages (ET/EN/SV) · 1×
                LEGO obsession (load-bearing)
              </p>
            </div>
            <p className="mt-10 text-sm font-semibold text-[#1a1a2e]/70">
              Missing a piece?{" "}
              <a href="mailto:joosepserva@gmail.com" className="text-[#006db7] underline">
                Customer service replies personally.
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Booklet nav */}
      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#1a1a2e] text-white transition-opacity disabled:opacity-30"
          aria-label="Previous page"
        >
          ‹
        </button>
        <div className="flex gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="h-2 w-2 rounded-full transition-transform"
              style={{
                background: i === page ? "#e3000b" : "rgba(26,26,46,0.2)",
                transform: i === page ? "scale(1.4)" : "scale(1)",
              }}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
          className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#1a1a2e] text-white transition-opacity disabled:opacity-30"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
