"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Part, Voxels, box, brickify, drawPart, painterSort, project, vkey } from "@/lib/iso";

const Y = "#f5c400";
const R = "#e3000b";
const B = "#006db7";
const G = "#00852b";
const W = "#f0ede6";
const D = "#4f5566";

const PRINCIPLES = [
  {
    stage: "Step 1 — the foundation",
    title: "Clear direction",
    body: "I want to know what we're building and why. I'll bring ideas, challenge assumptions, and think about the product — but I need a team that has a vision, not one that expects the engineer to figure out the business.",
    color: "bg-lego-green",
  },
  {
    stage: "Step 2 — the structure",
    title: "Build with, not for",
    body: "My best work happened when I had a great architect next to me — someone who pushed my thinking and helped me grow. I thrive when smart people from different roles bring their perspectives and we figure it out together.",
    color: "bg-lego-blue",
  },
  {
    stage: "Step 3 — the details",
    title: "Engineering over hype",
    body: "AI is an incredible tool — I use it every day. But the real value comes from knowing what to build, how to make it scale, and why it matters. Good engineering judgment doesn't get replaced, it gets amplified.",
    color: "bg-lego-red",
  },
];

/** The machine, one voxel map per assembly stage. */
function buildStages(): Part[][] {
  const stages: Voxels[] = [new Map(), new Map(), new Map()];
  // Stage 0 — foundation: base plate + green pad
  box(stages[0], 0, 0, 0, 14, 8, 1, D);
  box(stages[0], 1, 1, 1, 12, 6, 1, G);
  // Stage 1 — structure: machine body, full-height column, and a beam
  // that rests on BOTH the body top and the column top (real LEGO bridge,
  // nothing cantilevers into thin air).
  box(stages[1], 2, 2, 2, 6, 4, 4, B);
  box(stages[1], 9, 3, 2, 2, 2, 4, Y);
  box(stages[1], 6, 3, 6, 5, 2, 1, Y);
  // Stage 2 — details: hopper funnel, chimney, chute, output brick, lights
  box(stages[2], 4, 3, 6, 2, 2, 1, Y);
  box(stages[2], 3, 2, 7, 4, 4, 1, R);
  box(stages[2], 2, 2, 6, 1, 1, 3, D);
  box(stages[2], 2, 2, 9, 1, 1, 1, W);
  box(stages[2], 11, 3, 1, 3, 2, 1, D);
  box(stages[2], 12, 3, 2, 1, 2, 1, R); // the freshly made brick
  stages[2].set(vkey(3, 5, 4), Y); // indicator lights on the front
  stages[2].set(vkey(5, 5, 4), R);

  // Studs must respect the WHOLE machine, not just their own stage:
  // a foundation brick under the body shouldn't show studs, and every
  // exposed top should. Recompute studs against the combined voxel map.
  const combined: Voxels = new Map();
  for (const v of stages) for (const [k, c] of v) combined.set(k, c);
  return stages.map((v) =>
    painterSort(
      brickify(v).map((p) => ({
        ...p,
        studs: p.studs.filter(
          ([i, j]) => !combined.has(vkey(p.x + i, p.y + j, p.z + p.h)),
        ),
      })),
    ),
  );
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

/**
 * "How I build" — a scroll-pinned section where a LEGO brick factory
 * assembles itself in three stages as the three principles scroll by.
 * Scrubbed to scroll position, so it builds forward and disassembles
 * backward. Static layout on mobile / reduced motion.
 */
export function HowIBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(true);
  const stages = useMemo(buildStages, []);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 1023px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (small || reduce) setPinned(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const section = sectionRef.current;
    if (!canvas || !ctx || !section) return;

    const W_ = 520;
    const H_ = 440;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W_ * dpr;
    canvas.height = H_ * dpr;
    canvas.style.width = "100%";
    canvas.style.maxWidth = "520px";
    canvas.style.aspectRatio = `${W_} / ${H_}`;

    // Fit the complete machine once.
    const all = stages.flat();
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const b of all) {
      for (const [cx, cy] of [
        [b.x, b.y], [b.x + b.w, b.y], [b.x, b.y + b.d], [b.x + b.w, b.y + b.d],
      ]) {
        for (const cz of [b.z, b.z + b.h]) {
          const { px, py } = project(cx, cy, cz, 1);
          minX = Math.min(minX, px); maxX = Math.max(maxX, px);
          minY = Math.min(minY, py - 0.3); maxY = Math.max(maxY, py);
        }
      }
    }
    const s = Math.min((W_ * 0.9) / (maxX - minX), (H_ * 0.86) / (maxY - minY));
    const ox = (W_ - (maxX - minX) * s) / 2 - minX * s;
    const oy = (H_ - (maxY - minY) * s) / 2 - minY * s;
    // Per-brick landing spot + deterministic scatter for the fly-in.
    const layout = stages.map((parts) =>
      parts.map((b, i) => {
        const { px, py } = project(b.x, b.y, b.z, s);
        return {
          b,
          tx: px + ox,
          ty: py + oy,
          dx: (((i * 7919) % 200) - 100) * 0.6,
          dy: -300 - ((i * 104729) % 160),
        };
      }),
    );

    const render = (rawP: number) => {
      // Everything is fully seated by 90% of the pin, so the machine is
      // never caught mid-air as the section releases.
      const P = clamp01(rawP / 0.9);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W_, H_);
      layout.forEach((parts, si) => {
        const stageP = clamp01(P * 3 - si);
        const n = parts.length;
        parts.forEach((p, i) => {
          // Each brick claims a slice of its stage's progress window.
          const t0 = (i / n) * 0.6;
          const t = easeOut(clamp01((stageP - t0) / 0.3));
          if (t <= 0.01) return;
          drawPart(
            ctx,
            p.b,
            p.tx + p.dx * (1 - t),
            p.ty + p.dy * (1 - t),
            s,
            Math.min(1, t * 1.4),
          );
        });
      });
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!pinned) {
          render(1);
          setActive(2);
          return;
        }
        const rect = section.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const P = clamp01(-rect.top / Math.max(1, total));
        render(P);
        setActive(Math.min(2, Math.floor(P * 3)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [stages, pinned]);

  return (
    <section
      ref={sectionRef}
      className="bg-lego-black"
      style={{ height: pinned ? "300vh" : "auto" }}
    >
      <div
        className={
          pinned
            ? "sticky top-0 flex h-screen items-center px-6"
            : "px-6 py-24"
        }
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-3 rounded-sm bg-lego-yellow" />
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                How I Build
              </h2>
            </div>
            {pinned && (
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-lego-gray/60">
                Scroll to assemble
              </p>
            )}

            <div className={pinned ? "relative mt-10 min-h-[290px]" : "mt-10 space-y-8"}>
              {PRINCIPLES.map((p, i) => (
                <div
                  key={p.title}
                  className={
                    pinned
                      ? `absolute inset-0 transition-all duration-500 ${
                          active === i
                            ? "translate-y-0 opacity-100"
                            : active > i
                              ? "-translate-y-4 opacity-0"
                              : "translate-y-4 opacity-0"
                        }`
                      : ""
                  }
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-lego-yellow">
                    {p.stage}
                  </p>
                  <div className={`mt-3 h-1 w-12 rounded-full ${p.color}`} />
                  <h3 className="mt-4 text-2xl font-bold text-white">{p.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-lego-gray">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Stage dots */}
            <div className="mt-6 flex gap-2">
              {PRINCIPLES.map((p, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    active >= i ? `w-10 ${p.color}` : "w-2 bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <canvas ref={canvasRef} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
