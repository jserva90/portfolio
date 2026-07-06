"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Part, Voxels, box, brickify, disc, drawPart, painterSort, part, project, vkey } from "@/lib/iso";

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

/**
 * Falkenstein: an asymmetric crag castle. Stage 0 raises the rocky motte
 * out of a moat; stage 1 builds the ward, keep, bergfried and great hall;
 * stage 2 crowns it — machicolations, spires, a slope-built gabled roof,
 * banners and a courtyard tree.
 */
function buildStages(): { stages: Part[][]; pieces: number } {
  const TAN = "#d9c9a3";
  const BLU = "#2f6ec4";
  const v: Voxels[] = [new Map(), new Map(), new Map()];
  const extras: Part[][] = [[], [], []];

  // ── Stage 0 — grounds: moat, plank bridge, the crag ──
  box(v[0], 0, 0, 0, 48, 36, 1, G);
  box(v[0], 1, 1, 0, 46, 3, 1, BLU);
  box(v[0], 1, 32, 0, 46, 3, 1, BLU);
  box(v[0], 1, 4, 0, 3, 28, 1, BLU);
  box(v[0], 44, 4, 0, 3, 28, 1, BLU);
  box(v[0], 22, 29, 1, 4, 7, 1, WOOD); // bridge: ends on both banks
  // The crag — stacked, shrinking rock ellipses
  const crag: Array<[number, number]> = [
    [20, 14], [18.6, 13], [17.2, 12], [15.8, 11], [14.6, 10.2],
  ];
  crag.forEach(([rx, ry], i) => disc(v[0], 24, 17, 1 + i, rx, ry, D));
  box(v[0], 22, 22, 5, 4, 6, 1, D); // ramp shelf toward the bridge

  // ── Stage 1 — the ward on the crag ──
  const wz = 6; // plateau level
  box(v[1], 12, 8, wz, 24, 2, 5, S1); // north curtain
  box(v[1], 12, 24, wz, 10, 2, 5, S1); // south, left of gate
  box(v[1], 26, 24, wz, 10, 2, 5, S1); // south, right of gate
  box(v[1], 12, 10, wz, 2, 14, 5, S1); // west
  box(v[1], 34, 10, wz, 2, 14, 5, S1); // east
  // Corner towers — deliberately unequal heights
  const CTW: Array<[number, number, number]> = [
    [12.5, 8.5, 16], [35.5, 8.5, 17], [12.5, 25.5, 14], [35.5, 25.5, 13],
  ];
  for (const [cx, cy, top] of CTW) {
    for (let z = wz; z <= top; z++) disc(v[1], cx, cy, z, 2.6, 2.6, S1);
  }
  // Gatehouse: piers + load-bearing lintel + wooden gates
  box(v[1], 19, 23, wz, 3, 3, 7, S1);
  box(v[1], 26, 23, wz, 3, 3, 7, S1);
  box(v[1], 19, 24, wz + 7, 10, 2, 2, S1);
  box(v[1], 22, 25, wz, 4, 1, 6, WOOD);
  // The keep, with tan quoins up its corners
  box(v[1], 16, 11, wz, 9, 8, 14, S1);
  for (let z = wz; z < wz + 14; z++) {
    for (const [qx, qy] of [[16, 11], [24, 11], [16, 18], [24, 18]] as const) {
      v[1].set(vkey(qx, qy, z), TAN);
    }
  }
  // Stair turret hugging the keep's corner, taller than the keep
  for (let z = wz; z <= wz + 17; z++) disc(v[1], 25.5, 18.5, z, 1.7, 1.7, S1);
  // Bergfried — the slender watchtower that owns the skyline
  for (let z = wz; z <= wz + 19; z++) disc(v[1], 31.5, 12.5, z, 2.3, 2.3, S1);
  // Great hall against the east wall
  box(v[1], 27, 19, wz, 8, 6, 8, S1);
  // Windows — flush dark cells in the visible faces
  for (const [x, z] of [[18, 9], [21, 9], [18, 13], [21, 13], [18, 16], [21, 16]] as const) {
    v[1].set(vkey(x, 18, z), K);
    v[1].set(vkey(x, 18, z + 1), K);
  }
  for (const x of [28, 30, 32]) {
    v[1].set(vkey(x, 24, 9), K);
    v[1].set(vkey(x, 24, 10), K);
  }
  v[1].set(vkey(31, 14, 14), K); // bergfried slits
  v[1].set(vkey(31, 14, 19), K);

  // ── Stage 2 — the crown ──
  // Wall crenellations
  for (let x = 12; x <= 35; x += 2) {
    v[2].set(vkey(x, 8, wz + 5), S2);
    if (x <= 21 || x >= 26) v[2].set(vkey(x, 25, wz + 5), S2);
  }
  for (let y = 10; y <= 23; y += 2) {
    v[2].set(vkey(12, y, wz + 5), S2);
    v[2].set(vkey(35, y, wz + 5), S2);
  }
  for (let x = 19; x <= 28; x += 2) v[2].set(vkey(x, 25, wz + 9), S2);
  // Tower crowns: machicolated overhang ring, merlons, then a spire
  const crown = (cx: number, cy: number, top: number, r: number, roof: string, hSpire: number) => {
    disc(v[2], cx, cy, top + 1, r + 0.6, r + 0.6, S1);
    for (let k = 0; k < 360; k += 40) {
      const a = (k * Math.PI) / 180;
      v[2].set(
        vkey(Math.round(cx + Math.cos(a) * (r + 0.3) - 0.5), Math.round(cy + Math.sin(a) * (r + 0.3) - 0.5), top + 2),
        S2,
      );
    }
    for (let i = 0; i < hSpire; i++) {
      const rr = (r + 0.2) * (1 - (i + 1) / (hSpire + 1));
      disc(v[2], cx, cy, top + 2 + i, Math.max(0.6, rr), Math.max(0.6, rr), roof);
    }
    extras[2].push(part("cone", roof, Math.floor(cx), Math.floor(cy), top + 2 + hSpire));
    extras[2].push(part("cylinder", Y, Math.floor(cx), Math.floor(cy), top + 3 + hSpire, 1, 1, 1 / 3));
  };
  for (const [cx, cy, top] of CTW) crown(cx, cy, top, 2.6, R, 3);
  crown(31.5, 12.5, wz + 19, 2.3, BLU, 4); // bergfried in blue
  crown(25.5, 18.5, wz + 17, 1.7, R, 2); // stair turret
  // Keep: eave + steep stepped pyramid + banner
  box(v[2], 15, 10, wz + 14, 11, 10, 1, S2);
  box(v[2], 16, 11, wz + 15, 9, 8, 1, R);
  box(v[2], 17, 12, wz + 16, 7, 6, 1, R);
  box(v[2], 18, 13, wz + 17, 5, 4, 1, R);
  box(v[2], 19, 14, wz + 18, 3, 2, 1, R);
  box(v[2], 20, 14, wz + 19, 1, 1, 3, D);
  extras[2].push(part("plate", R, 21, 14, wz + 21, 2, 1));
  // Great hall: gabled roof from real slope pieces
  box(v[2], 27, 19, wz + 8, 8, 4, 1, R);
  for (let x = 27; x < 35; x++) extras[2].push(part("slope", R, x, 23, wz + 8, 1, 1, 1, 1));
  box(v[2], 27, 19, wz + 9, 8, 2, 1, R);
  for (let x = 27; x < 35; x++) extras[2].push(part("slope", R, x, 21, wz + 9, 1, 1, 1, 1));
  for (let x = 27; x < 35; x++) extras[2].push(part("tile", Y, x, 19, wz + 10, 1, 2));
  // Courtyard tree
  box(v[2], 28, 14, wz, 1, 1, 2, WOOD);
  disc(v[2], 28.5, 14.5, wz + 2, 1.8, 1.8, G);
  disc(v[2], 28.5, 14.5, wz + 3, 1.3, 1.3, G);
  disc(v[2], 28.5, 14.5, wz + 4, 0.7, 0.7, G);

  // Weathered mottle: rock heavier, masonry lighter
  for (const [map, rate] of [[v[0], 3], [v[1], 2], [v[2], 2]] as const) {
    for (const [key, c] of map) {
      if (c !== S1 && c !== D) continue;
      const [x, y, z] = key.split(",").map(Number);
      if ((x * 13 + y * 7 + z * 17) % 10 < rate) map.set(key, c === D ? "#5d6470" : S2);
    }
  }

  const stages = v.map((m, i) =>
    painterSort(
      brickify(m)
        .map((p) => ({
          ...p,
          studs: Array.from({ length: p.w * p.d }, (_, k) => [
            k % p.w,
            Math.floor(k / p.w),
          ]) as Array<[number, number]>,
        }))
        .concat(extras[i]),
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
