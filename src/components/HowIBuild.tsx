"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Part, Voxels, box, brickify, disc, drawPart, painterSort, project, vkey } from "@/lib/iso";

const S1 = "#a8adb2"; // castle stone, light
const S2 = "#7d8288"; // castle stone, weathered
const G = "#00852b";
const D = "#4f5566";
const R = "#e3000b";
const Y = "#f5c400";
const WOOD = "#582a12";
const K = "#2a2440";

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

/** A full castle, one voxel map per assembly stage. */
function buildStages(): { stages: Part[][]; pieces: number } {
  const v: Voxels[] = [new Map(), new Map(), new Map()];
  const TOWERS: Array<[number, number]> = [
    [4.5, 4.5],
    [38.5, 4.5],
    [4.5, 28.5],
    [38.5, 28.5],
  ];

  // ── Stage 0 — foundation: grounds + stone path to the gate ──
  box(v[0], 0, 0, 0, 44, 34, 1, G);
  box(v[0], 19, 26, 0, 6, 8, 1, D);

  // ── Stage 1 — structure: curtain walls, towers, gatehouse, keep ──
  box(v[1], 4, 4, 1, 36, 2, 7, S1); // back wall
  box(v[1], 4, 28, 1, 15, 2, 7, S1); // front wall, left of gate
  box(v[1], 25, 28, 1, 15, 2, 7, S1); // front wall, right of gate
  box(v[1], 4, 6, 1, 2, 22, 7, S1); // west wall
  box(v[1], 38, 6, 1, 2, 22, 7, S1); // east wall
  for (const [cx, cy] of TOWERS) {
    for (let z = 1; z <= 12; z++) disc(v[1], cx, cy, z, 3.2, 3.2, S1);
  }
  // Gatehouse: two piers, and a lintel that RESTS on both pier tops.
  box(v[1], 16, 26, 1, 3, 4, 7, S1);
  box(v[1], 25, 26, 1, 3, 4, 7, S1);
  box(v[1], 16, 28, 8, 12, 2, 2, S1);
  box(v[1], 19, 29, 1, 6, 1, 7, WOOD); // gate doors, flush under the lintel
  // Keep
  box(v[1], 14, 10, 1, 12, 10, 13, S1);
  // Windows & arrow slits live in the SAME map as their walls, so the
  // bricker fits them flush into the masonry — no overlapping voxels.
  for (const [x, z] of [
    [16, 9], [23, 9], [16, 5], [23, 5], [19, 11], [20, 11],
  ] as const) {
    v[1].set(vkey(x, 19, z), K);
  }
  v[1].set(vkey(25, 13, 8), K);
  v[1].set(vkey(25, 16, 8), K);
  for (const [cx, cy] of TOWERS) {
    v[1].set(vkey(Math.floor(cx), Math.round(cy + 2.5), 5), K);
    v[1].set(vkey(Math.floor(cx), Math.round(cy + 2.5), 9), K);
  }

  // ── Stage 2 — details: crenellations, parapets, roofs, banner ──
  for (let x = 4; x <= 39; x += 2) {
    v[2].set(vkey(x, 4, 8), S2);
    if (x <= 18 || x >= 25) v[2].set(vkey(x, 29, 8), S2);
  }
  for (let y = 6; y <= 27; y += 2) {
    v[2].set(vkey(4, y, 8), S2);
    v[2].set(vkey(39, y, 8), S2);
  }
  for (let x = 16; x <= 27; x += 2) v[2].set(vkey(x, 29, 10), S2); // lintel parapet
  for (const [cx, cy] of TOWERS) {
    // Parapet ring on the tower top, walkway hole in the middle
    disc(v[2], cx, cy, 13, 3.4, 3.4, S1);
    for (let x = Math.floor(cx - 4); x <= Math.ceil(cx + 4); x++) {
      for (let y = Math.floor(cy - 4); y <= Math.ceil(cy + 4); y++) {
        if (Math.hypot(x + 0.5 - cx, y + 0.5 - cy) < 2.0) v[2].delete(vkey(x, y, 13));
      }
    }
    for (let k = 0; k < 360; k += 45) {
      const a = (k * Math.PI) / 180;
      v[2].set(
        vkey(Math.round(cx + Math.cos(a) * 2.9 - 0.5), Math.round(cy + Math.sin(a) * 2.9 - 0.5), 14),
        S2,
      );
    }
    // Red cone roof, resting on the parapet ring
    [2.6, 2.0, 1.4, 0.7].forEach((r, i) => disc(v[2], cx, cy, 14 + i, r, r, R));
  }
  // Keep roof: stone eave, red pyramid, pole + banner
  box(v[2], 13, 9, 14, 14, 12, 1, S2);
  box(v[2], 14, 10, 15, 12, 10, 1, R);
  box(v[2], 16, 12, 16, 8, 6, 1, R);
  box(v[2], 18, 13, 17, 4, 3, 1, R);
  box(v[2], 19, 14, 18, 1, 1, 3, D);
  box(v[2], 20, 14, 20, 2, 1, 1, Y);

  // Weathered-stone mottle: breaks up the masonry into varied pieces.
  for (const map of [v[1], v[2]]) {
    for (const [key, c] of map) {
      if (c !== S1) continue;
      const [x, y, z] = key.split(",").map(Number);
      if ((x * 13 + y * 7 + z * 17) % 10 < 2) map.set(key, S2);
    }
  }

  // Every brick gets ALL of its studs — stacking covers them naturally.
  const stages = v.map((m) =>
    painterSort(
      brickify(m).map((p) => ({
        ...p,
        studs: Array.from({ length: p.w * p.d }, (_, k) => [
          k % p.w,
          Math.floor(k / p.w),
        ]) as Array<[number, number]>,
      })),
    ),
  );
  return { stages, pieces: stages.reduce((a, s) => a + s.length, 0) };
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
  const { stages, pieces } = useMemo(buildStages, []);

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
          // Straight vertical drop — bricks are placed, not scattered.
          dx: 0,
          dy: -180 - ((i * 104729) % 90),
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
                Scroll to assemble · {pieces.toLocaleString()} pieces
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
