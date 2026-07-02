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
        {manual ? "Back to normal CV" : "View as building instructions"}
      </button>
      <div className={manual ? "hidden print:block" : ""}>{cv}</div>
      {manual && <ManualCv />}
    </>
  );
}

type Piece = { label: string; color: string; w: number; quip: string };
type Step = { year: string; title: string; body: string; pieces: Piece[] };

const RED = "#e3000b";
const YELLOW = "#f5c400";
const BLUE = "#006db7";
const GREEN = "#00852b";

const STEPS: Step[] = [
  {
    year: "2010",
    title: "Lay the foundation",
    body: "Start with a BSc in clinical psychology. It looks like a detour — it's actually the base plate: understanding how people think is half of every engineering job.",
    pieces: [{ label: "1× BSc Psychology", color: YELLOW, w: 4, quip: "Warning: causes chronic empathy" }],
  },
  {
    year: "2019",
    title: "Attach the horn",
    body: "Add a BA in French horn and a chair in the Defense Force orchestra. Installs discipline, precision, and performing under pressure.",
    pieces: [
      { label: "1× BA Horn", color: GREEN, w: 3, quip: "Loud. Very loud." },
      { label: "1× Orchestra chair", color: GREEN, w: 2, quip: "First chair, obviously" },
    ],
  },
  {
    year: "2022",
    title: "Snap on the code",
    body: "kood/Jõhvi — no teachers, just projects. Complete the 2-year curriculum in under 8 months, top 5% of 500+ students.",
    pieces: [
      { label: "1× kood/Jõhvi", color: BLUE, w: 4, quip: "Speedrun: 8mo / 2yr any%" },
      { label: "1× Top 5%", color: YELLOW, w: 2, quip: "Of 500+ builders" },
    ],
  },
  {
    year: "2023",
    title: "First load-bearing wall",
    body: "LHV Bank, full stack: Java, Angular, Kubernetes. Business-critical treasury tooling where broken things are not tolerated.",
    pieces: [{ label: "1× LHV full stack", color: GREEN, w: 4, quip: "Banks don't do 'oops'" }],
  },
  {
    year: "2024",
    title: "A quick reinforcement",
    body: "Solutional consultancy — extreme programming and pair programming, properly practiced.",
    pieces: [{ label: "1× XP practice", color: YELLOW, w: 2, quip: "Two keyboards, one brain" }],
  },
  {
    year: "2024",
    title: "Install the AI wing",
    body: "Back to LHV with an AI focus: the plug-and-play RAG platform, Kindlustusguru (Project of the Year), the Slack incident router, bank-wide SageMaker.",
    pieces: [
      { label: "1× RAG platform", color: BLUE, w: 4, quip: "Some assembly required" },
      { label: "1× Project of the Year", color: RED, w: 2, quip: "Shiny. Official." },
    ],
  },
  {
    year: "2025",
    title: "Top it off",
    body: "Avokaado, Applied AI Engineer: the whole document-to-agent pipeline — parsing, structure, variables, LangGraph orchestration.",
    pieces: [
      { label: "1× AI pipeline", color: RED, w: 4, quip: "Documents in, agents out" },
      { label: "1× LangGraph agents", color: BLUE, w: 2, quip: "They mostly obey" },
    ],
  },
];

const SKILLS = [
  "Python", "TypeScript", "Java", "LangChain", "LangGraph", "RAG",
  "AWS", "SageMaker", "Terraform", "Kubernetes", "OpenSearch",
  "Spring Boot", "Angular", "React", "Docling", "Azure AI",
];

const KEYFRAMES = `
@keyframes mcv-page-in {
  0% { opacity: 0; transform: perspective(1200px) rotateY(-14deg) translateX(30px); }
  100% { opacity: 1; transform: perspective(1200px) rotateY(0) translateX(0); }
}
@keyframes mcv-drop {
  0% { opacity: 0; transform: translateY(-260px) rotate(-9deg); }
  55% { opacity: 1; transform: translateY(0) rotate(2deg); }
  70% { transform: translateY(-14px) rotate(-1deg); }
  85% { transform: translateY(0) rotate(0.5deg); }
  100% { opacity: 1; transform: translateY(0) rotate(0); }
}
@keyframes mcv-pop {
  0% { opacity: 0; transform: scale(0.4) rotate(-6deg); }
  70% { transform: scale(1.12) rotate(2deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}
@keyframes mcv-shake {
  0%, 100% { transform: rotate(0); }
  20% { transform: rotate(-2.5deg) translateX(-6px); }
  40% { transform: rotate(2.5deg) translateX(6px); }
  60% { transform: rotate(-1.8deg) translateX(-4px); }
  80% { transform: rotate(1.2deg) translateX(3px); }
}
@keyframes mcv-wiggle {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-4deg) scale(1.06); }
  75% { transform: rotate(4deg) scale(1.06); }
}
@keyframes mcv-glow {
  0%, 100% { box-shadow: 0 3px 8px rgba(0,0,0,0.35); }
  50% { box-shadow: 0 3px 18px rgba(245,196,0,0.75); }
}
@keyframes mcv-float {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-8px) rotate(1deg); }
}
@media (prefers-reduced-motion: reduce) {
  .mcv-anim { animation: none !important; }
}
`;

function Brick({
  piece,
  dim,
  drop,
  delay,
  glow,
}: {
  piece: Piece;
  dim?: boolean;
  drop?: boolean;
  delay?: number;
  glow?: boolean;
}) {
  const [wiggle, setWiggle] = useState(0);
  const [tip, setTip] = useState(false);
  return (
    <div className="relative">
      <button
        key={wiggle}
        onClick={() => {
          setWiggle((w) => w + 1);
          setTip(true);
          setTimeout(() => setTip(false), 1400);
        }}
        className="mcv-anim flex h-8 cursor-pointer items-center gap-2 rounded-[3px] px-2 transition-opacity"
        style={{
          width: piece.w * 44,
          background: piece.color,
          opacity: dim ? 0.45 : 1,
          boxShadow: dim ? "none" : "0 3px 8px rgba(0,0,0,0.35)",
          animation: [
            drop ? `mcv-drop 0.7s cubic-bezier(.3,.7,.4,1) ${delay ?? 0}ms backwards` : wiggle ? "mcv-wiggle 0.4s ease" : "",
            glow ? "mcv-glow 1.8s ease-in-out infinite" : "",
          ]
            .filter(Boolean)
            .join(", "),
        }}
        title="Click me!"
      >
        {Array.from({ length: piece.w }).map((_, i) => (
          <span key={i} className="h-3 w-3 shrink-0 rounded-full bg-white/30" />
        ))}
      </button>
      {tip && (
        <span
          className="mcv-anim absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm bg-[#1a1a2e] px-2 py-1 text-[10px] font-bold text-white"
          style={{ animation: "mcv-pop 0.25s ease" }}
        >
          {piece.quip}
        </span>
      )}
    </div>
  );
}

/** The booklet: shake the box open, bricks rain in with bounce, confetti at the end. */
function ManualCv() {
  const totalPages = STEPS.length + 2;
  const [page, setPage] = useState(0);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setPage((p) => Math.min(p + 1, totalPages - 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(p - 1, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages]);

  const stepIndex = page - 1;
  const totalPieces = STEPS.reduce((a, s) => a + s.pieces.length, 0);
  const piecesSoFar = STEPS.slice(0, Math.max(0, Math.min(stepIndex + 1, STEPS.length))).reduce(
    (a, s) => a + s.pieces.length,
    0,
  );

  const openBox = () => {
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setPage(1);
    }, 550);
  };

  return (
    <div className="no-print mx-auto max-w-[840px] px-6 pb-24 pt-24 text-[#1a1a2e]">
      <style>{KEYFRAMES}</style>
      <div
        key={page}
        className="mcv-anim relative min-h-[540px] rounded-md border-4 border-[#1a1a2e] bg-[#fffdf5] p-8 shadow-2xl md:p-12"
        style={{ animation: shaking ? "mcv-shake 0.5s ease" : "mcv-page-in 0.5s ease" }}
      >
        {/* Cover — the set box. Shake it open. */}
        {page === 0 && (
          <button
            onClick={openBox}
            className="flex min-h-[440px] w-full cursor-pointer flex-col items-center justify-center text-center"
          >
            <div className="mb-6 flex gap-2">
              {[RED, YELLOW, BLUE, GREEN].map((c, i) => (
                <span
                  key={c}
                  className="mcv-anim h-5 w-10 rounded-[3px]"
                  style={{ background: c, animation: `mcv-drop 0.6s ease ${i * 110}ms backwards` }}
                />
              ))}
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#1a1a2e]/50">
              Building instructions
            </p>
            <h1
              className="font-display mcv-anim mt-3 text-5xl font-extrabold"
              style={{ animation: "mcv-pop 0.5s ease 0.3s backwards" }}
            >
              SET 1990
            </h1>
            <h2
              className="font-display mcv-anim mt-1 text-3xl font-bold text-[#e3000b]"
              style={{ animation: "mcv-pop 0.5s ease 0.45s backwards" }}
            >
              Joosep Serva
            </h2>
            <p className="mt-4 font-mono text-sm text-[#1a1a2e]/60">
              {totalPieces} pcs · ages 3+ · assembly time: ~15 years
            </p>
            <p
              className="mcv-anim mt-10 rounded-sm bg-[#f5c400] px-4 py-2 text-xs font-bold uppercase tracking-wider"
              style={{ animation: "mcv-float 2.2s ease-in-out infinite" }}
            >
              Shake the box to open
            </p>
          </button>
        )}

        {/* Steps */}
        {stepIndex >= 0 && stepIndex < STEPS.length && (
          <div className="grid min-h-[440px] gap-8 md:grid-cols-[1fr_280px]">
            <div>
              <div className="flex items-baseline gap-4">
                <span
                  className="font-display mcv-anim text-7xl font-extrabold text-[#1a1a2e]/15"
                  style={{ animation: "mcv-pop 0.45s ease backwards" }}
                >
                  {stepIndex + 1}
                </span>
                <div>
                  <p className="font-mono text-xs text-[#1a1a2e]/50">{STEPS[stepIndex].year}</p>
                  <h2
                    className="font-display mcv-anim text-2xl font-bold"
                    style={{ animation: "mcv-pop 0.45s ease 0.1s backwards" }}
                  >
                    {STEPS[stepIndex].title}
                  </h2>
                </div>
              </div>
              <p className="mt-4 max-w-md leading-relaxed text-[#1a1a2e]/70">
                {STEPS[stepIndex].body}
              </p>
              <div className="mt-6 inline-block rounded-sm border-2 border-dashed border-[#1a1a2e]/30 p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#1a1a2e]/50">
                  New pieces — click them!
                </p>
                <div className="space-y-2">
                  {STEPS[stepIndex].pieces.map((p, i) => (
                    <div key={p.label} className="flex items-center gap-3">
                      <Brick piece={p} drop delay={250 + i * 160} />
                      <span className="text-xs font-semibold">{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* The growing build: new bricks rain in and bounce */}
            <div className="flex flex-col items-center justify-end">
              <div className="flex flex-col-reverse items-center gap-1">
                {STEPS.slice(0, stepIndex + 1).flatMap((s, si) =>
                  s.pieces.map((p, pi) => (
                    <Brick
                      key={`${si}-${p.label}`}
                      piece={p}
                      dim={si < stepIndex}
                      drop={si === stepIndex}
                      delay={400 + pi * 220}
                      glow={si === stepIndex}
                    />
                  )),
                )}
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[#1a1a2e]/40">
                The build so far · {piecesSoFar}/{totalPieces} pcs
              </p>
            </div>
          </div>
        )}

        {/* Parts inventory + confetti finale */}
        {stepIndex === STEPS.length && (
          <div className="relative min-h-[440px]">
            <h2
              className="font-display mcv-anim text-3xl font-bold"
              style={{ animation: "mcv-pop 0.5s ease backwards" }}
            >
              Build complete!
            </h2>
            <p className="mt-2 text-sm text-[#1a1a2e]/60">
              Every piece used in this set.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SKILLS.map((s, i) => (
                <span
                  key={s}
                  className="mcv-anim rounded-sm bg-[#f2f2f0] px-3 py-1.5 font-mono text-xs font-semibold text-[#1a1a2e]/70"
                  style={{ animation: `mcv-pop 0.4s ease ${i * 45}ms backwards` }}
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
          className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#1a1a2e] text-white transition-transform hover:scale-110 disabled:opacity-30"
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
          className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#1a1a2e] text-white transition-transform hover:scale-110 disabled:opacity-30"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
