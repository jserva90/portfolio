"use client";

import { useEffect, useRef, useState } from "react";
import {
  Part,
  Voxels,
  box,
  brickify,
  disc,
  discYZ,
  drawPart,
  painterSort,
  part,
  project,
  ringXZ,
  vkey,
} from "@/lib/iso";

// LEGO palette
const Y = "#f5c400"; // brass / duck yellow
const R = "#e3000b"; // red
const W = "#f0ede6"; // white
const K = "#3a3a55"; // dark (windows, eyes, flag black)
const B = "#006db7"; // blue
const G = "#9aa3ad"; // light gray (valve caps, ferrules)
const D = "#4f5566"; // dark gray (display stand)
const L1 = "#ddd6c4"; // limestone, light
const L2 = "#c7bda6"; // limestone, tan
const L3 = "#a89e87"; // limestone, weathered
const N1 = "#4a5178"; // AI brain, slate
const N2 = "#383e5c"; // AI brain, deep slate
const E = "#3dd9eb"; // electric cyan (circuit traces)
const LB = "#79c7e8"; // light blue (water shimmer)

type SculptureDef = {
  name: string;
  story: string;
  /** Bulk volumes go into voxels (auto-bricked); catalog parts for detail. */
  build: (v: Voxels, parts: Part[]) => void;
};

const SCULPTURES: SculptureDef[] = [
  {
    name: "French horn",
    story: "played professionally in the Defense Force orchestra",
    build: (v, parts) => {
      // Tubing: main coil + inner wrap, z-compressed so the rings render
      // circular despite bricks being taller than wide.
      ringXZ(v, 8, 9, 2, 2, 7.5, 5.7, Y, 1.2);
      ringXZ(v, 8, 9, 2, 2, 3.4, 2.0, Y, 1.2);
      // Bell: widening cone emerging through the coil, mouth to the right.
      const bell: Array<[number, number, number]> = [
        [10, 5.4, 1.1],
        [11, 5.2, 1.5],
        [12, 5.0, 1.9],
        [13, 4.8, 2.3],
        [14, 4.6, 2.8],
        [15, 4.5, 3.3],
      ];
      for (const [x, cz, r] of bell) discYZ(v, x, 3, cz, r, Y);
      // Flared rim with a dark interior you can look into.
      discYZ(v, 16, 3, 4.4, 3.9, Y);
      discYZ(v, 16, 3, 4.4, 2.7, K);

      // Technic display stand: plate base, smooth tile trim, pin-holed
      // beams under the coil, and a beam foot under the bell rim.
      parts.push(
        part("plate", D, 3, 1, 0, 8, 4),
        part("tile", D, 3, 1, 1 / 3, 4, 1),
        part("tile", D, 7, 1, 1 / 3, 4, 1),
        part("technic", D, 6, 2, 1 / 3, 3, 1),
        part("technic", D, 6, 2, 4 / 3, 3, 1),
        part("plate", D, 6, 2, 7 / 3, 3, 1),
        part("plate", D, 6, 2, 8 / 3, 3, 1),
        part("technic", D, 14, 2, 0, 2, 1),
      );

      // Rotary valve cluster, SNOT-mounted on the front of the coil:
      // cylinder casings with smooth dark caps and cheese-slope levers.
      for (const x of [5, 7, 9]) {
        parts.push(
          part("cheese", K, x, 4, 7 + 1 / 3, 1, 1, 2 / 3, 1),
          part("cylinder", G, x, 4, 8),
          part("roundTile", K, x, 4, 9),
        );
      }

      // Slide crooks bridging the gap between the wraps.
      for (const [x, z] of [
        [3, 9],
        [11, 9],
        [7, 5],
      ] as const) {
        parts.push(
          part("plate", Y, x, 2, z, 2, 2),
          part("tile", Y, x, 2, z + 1 / 3, 2, 2),
        );
      }

      // Smooth tile tubing along the top arc of the coil.
      parts.push(
        part("tile", Y, 5, 2, 16, 2, 2),
        part("tile", Y, 7, 2, 16, 2, 2),
        part("tile", Y, 9, 2, 16, 2, 2),
      );

      // Leadpipe: plate-stepped taper up to a gray cone mouthpiece.
      for (let i = 0; i < 6; i++) {
        parts.push(part("plate", Y, 1 - i, 2, 13 + (i + 1) / 3, 2, 1));
      }
      parts.push(part("cone", G, -5, 2, 15 + 1 / 3, 1, 1, 2 / 3));

      // Gray ferrule accents where the wraps are braced.
      parts.push(part("tile", G, 3, 4, 12), part("tile", G, 12, 4, 12));
    },
  },
  {
    name: "Dala horse",
    story: "grew up in Sweden",
    build: (v, parts) => {
      // Legs with white painted hooves
      for (const [lx, ly] of [
        [2, 0],
        [2, 3],
        [9, 0],
        [9, 3],
      ] as const) {
        box(v, lx, ly, 0, 2, 1, 5, R);
        box(v, lx, ly, 0, 2, 1, 1, W);
      }
      // Body
      box(v, 1, 0, 5, 11, 4, 4, R);
      // Neck and head, facing right
      box(v, 8, 1, 9, 3, 2, 3, R);
      box(v, 9, 1, 12, 4, 2, 2, R);
      box(v, 13, 1, 12, 1, 2, 1, W); // white muzzle
      // Kurbits paintwork: white saddle with a blue top band, blue chest
      // band, and a blue bridle stripe — classic Dala decoration.
      box(v, 5, 0, 5, 2, 4, 4, W);
      box(v, 5, 0, 8, 2, 4, 1, B);
      box(v, 11, 0, 6, 1, 4, 2, B);
      box(v, 12, 1, 12, 1, 2, 2, B);
      // Eye on the visible cheek
      v.set(vkey(10, 2, 13), K);

      parts.push(
        // Cheese-slope ears and a tapered nose
        part("cheese", R, 9, 1, 14),
        part("cheese", R, 9, 2, 14),
        part("cheese", W, 13, 1, 13, 1, 2, 2 / 3),
        // Yellow painted dots on the saddle
        part("cylinder", Y, 5, 1, 9, 1, 1, 1 / 3),
        part("cylinder", Y, 6, 2, 9, 1, 1, 1 / 3),
      );
    },
  },
  {
    name: "AI brain",
    story: "BSc in psychology — now wiring artificial minds",
    build: (v, parts) => {
      const layers: Array<[number, number, number]> = [
        [1, 5, 3],
        [2, 6.5, 4],
        [3, 7, 4.2],
        [4, 7, 4.2],
        [5, 6.5, 4],
        [6, 5.5, 3.4],
        [7, 4, 2.5],
      ];
      for (const [z, rx, ry] of layers) disc(v, 7, 4, z, rx, ry, N1);
      // Cerebellum at the back-bottom.
      disc(v, 3, 4, 0, 2.5, 2.2, N2);
      // Mid-sagittal groove along the top.
      for (let x = 0; x <= 14; x++) {
        v.delete(vkey(x, 4, 7));
        v.delete(vkey(x, 4, 6));
      }
      // Mottle so the auto-bricker builds organic folds.
      for (const [key, color] of v) {
        if (color !== N1) continue;
        const [x, y, z] = key.split(",").map(Number);
        if ((x * 7 + y * 13 + z * 31) % 9 < 2) v.set(key, N2);
      }
      // Electric circuit traces running across the cortex surface: paint
      // the outermost voxel cyan along horizontal and vertical paths.
      const traceFront = (z: number, x0: number, x1: number) => {
        for (let x = x0; x <= x1; x++) {
          for (let y = 10; y >= 0; y--) {
            if (v.has(vkey(x, y, z))) {
              v.set(vkey(x, y, z), E);
              break;
            }
          }
        }
      };
      const traceFrontV = (x: number, z0: number, z1: number) => {
        for (let z = z0; z <= z1; z++) {
          for (let y = 10; y >= 0; y--) {
            if (v.has(vkey(x, y, z))) {
              v.set(vkey(x, y, z), E);
              break;
            }
          }
        }
      };
      const traceSide = (z: number, y0: number, y1: number) => {
        for (let y = y0; y <= y1; y++) {
          for (let x = 16; x >= 0; x--) {
            if (v.has(vkey(x, y, z))) {
              v.set(vkey(x, y, z), E);
              break;
            }
          }
        }
      };
      traceFront(2, 3, 8);
      traceFront(5, 6, 11);
      traceFrontV(8, 2, 5);
      traceFrontV(4, 5, 7);
      traceSide(3, 1, 4);

      parts.push(
        // Technic brainstem: pin holes read as I/O ports.
        part("technic", D, 6, 3, 0, 2, 1),
        // Antenna electrodes with glowing tips.
        part("bar", G, 9, 3, 8, 1, 1, 1.6),
        part("roundTile", E, 9, 3, 9.6),
        part("bar", G, 5, 2, 8, 1, 1, 2.2),
        part("roundTile", E, 5, 2, 10.2),
        // Glowing node studs on the cortex.
        part("cylinder", E, 6, 2, 8, 1, 1, 1 / 3),
        part("cylinder", E, 10, 4, 7, 1, 1, 1 / 3),
      );
    },
  },
  {
    name: "Rubber duck",
    story: "the best debugging partner doesn't interrupt",
    build: (v, parts) => {
      // Pond base with shimmer mottling.
      disc(v, 5, 2, -1, 7.5, 5, B);
      for (const [key, color] of v) {
        if (color !== B) continue;
        const [x, y, z] = key.split(",").map(Number);
        if ((x * 11 + y * 5 + z * 3) % 7 < 2) v.set(key, LB);
      }
      // Plump body
      box(v, 2, 1, 0, 8, 4, 1, Y);
      box(v, 1, 0, 1, 10, 6, 2, Y);
      box(v, 2, 1, 3, 8, 4, 1, Y);
      // Head
      box(v, 6, 1, 4, 4, 4, 3, Y);

      parts.push(
        // Dome crown rounding the head.
        part("dome", Y, 7, 2, 7, 2, 2),
        // Beak: flat lower bill with an angled upper bill.
        part("plate", R, 10, 2, 5, 2, 2),
        part("cheese", R, 10, 2, 5 + 1 / 3, 2, 2, 2 / 3),
        // Button eye, SNOT-mounted on the visible cheek.
        part("roundTile", K, 8, 5, 6),
        // Tail kicking up at the back.
        part("slope", Y, 0, 2, 3, 2, 2, 1),
        part("plate", Y, 0, 2, 4, 1, 2),
        // Wing ridge along the visible flank.
        part("slope", Y, 3, 5, 3, 3, 1, 2 / 3),
        // Smooth ripple tiles on the water.
        part("tile", LB, 1, 5, 0, 2, 1),
        part("tile", LB, 8, 6, 0, 2, 1),
        part("tile", LB, 11, 3, 0, 1, 1),
      );
    },
  },
  {
    name: "Pikk Hermann",
    story: "home — Tallinn, Estonia",
    build: (v, parts) => {
      const C = 5; // tower axis
      // Place voxels around the rim at angular steps (merlons, arch marks).
      const rim = (
        r: number,
        z: number,
        step: number,
        offset: number,
        color: string,
      ) => {
        for (let k = 0; k < 360; k += step) {
          const a = ((k + offset) * Math.PI) / 180;
          v.set(
            vkey(Math.round(C + Math.cos(a) * r), Math.round(C + Math.sin(a) * r), z),
            color,
          );
        }
      };

      // Foundation plinth, then the round limestone shaft.
      disc(v, C, C, 0, 4.3, 4.3, L3);
      for (let z = 1; z <= 14; z++) disc(v, C, C, z, 3.6, 3.6, L1);
      // Overhanging machicolation crown.
      for (const z of [15, 16]) disc(v, C, C, z, 4.6, 4.6, L1);
      // Parapet: a ring (interior carved out so the walkway shows).
      disc(v, C, C, 17, 4.6, 4.6, L1);
      for (let x = 0; x <= 10; x++) {
        for (let y = 0; y <= 10; y++) {
          if (Math.hypot(x - C, y - C) <= 3.0) v.delete(vkey(x, y, 17));
        }
      }
      // Mottle the masonry: three limestone shades, deterministic.
      for (const [key, color] of v) {
        if (color !== L1) continue;
        const [x, y, z] = key.split(",").map(Number);
        const h = (x * 13 + y * 7 + z * 17) % 10;
        if (h >= 8) v.set(key, L3);
        else if (h >= 5) v.set(key, L2);
      }
      // Dark arch shadows under the crown (machicolation openings).
      rim(3.6, 14, 30, 15, K);
      // Crenellation merlons on the parapet.
      rim(4.2, 18, 30, 0, L2);
      // Window slits down the shaft, on the faces toward the viewer.
      for (const [x, y, z] of [
        [8, 5, 4],
        [7, 7, 7],
        [8, 5, 10],
        [5, 8, 12],
      ] as const) {
        v.set(vkey(x, y, z), K);
      }

      // Roof hub, flagpole, and the Estonian tricolor flying clear of the
      // parapet.
      parts.push(
        part("cylinder", L3, C, C, 17, 1, 1, 2 / 3),
        part("bar", G, C, C, 17 + 2 / 3, 1, 1, 4),
        part("plate", B, 6, 5, 21, 3, 1),
        part("plate", K, 6, 5, 20 + 2 / 3, 3, 1),
        part("plate", W, 6, 5, 20 + 1 / 3, 3, 1),
      );
    },
  },
];

const SPRING = 130;
const DRAG = 6.5;
const REPEL_RADIUS = 85;
const REPEL_FORCE = 2400;
const EXPLODE_MS = 380;

type Piece = {
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  brick: Part;
  scale: number;
  alpha: number;
  dying: boolean;
  activateAt: number; // build-stagger: drift until this timestamp
};

type Model = {
  bricks: Part[];
  scale: number;
  targets: Array<{ tx: number; ty: number }>;
};

/**
 * An isometric LEGO sculpture that morphs through five models from
 * Joosep's life. Bricks are real LEGO sizes (1x1 up to 2x4) generated
 * from voxel volumes; click to explode, and the pieces rebuild the next
 * model layer by layer, bottom-up.
 */
export function BrickSculpture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let pieces: Piece[] = [];
    let models: Model[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;
    let last = 0;
    let visible = true;
    let disposed = false;
    let morphTimer: ReturnType<typeof setTimeout> | null = null;
    let lastClick = 0;
    const mouse = { x: -9999, y: -9999 };

    function computeModels() {
      models = SCULPTURES.map((def) => {
        const v: Voxels = new Map();
        const detail: Part[] = [];
        def.build(v, detail);
        const bricks = painterSort([...brickify(v), ...detail]);

        // Projected bounds at scale 1 (all 8 corners of every brick).
        let minX = Infinity,
          maxX = -Infinity,
          minY = Infinity,
          maxY = -Infinity;
        for (const b of bricks) {
          for (const [cx, cy] of [
            [b.x, b.y],
            [b.x + b.w, b.y],
            [b.x, b.y + b.d],
            [b.x + b.w, b.y + b.d],
          ]) {
            for (const cz of [b.z, b.z + b.h]) {
              const { px, py } = project(cx, cy, cz, 1);
              minX = Math.min(minX, px);
              maxX = Math.max(maxX, px);
              minY = Math.min(minY, py - 0.3); // stud headroom
              maxY = Math.max(maxY, py);
            }
          }
        }
        const scale = Math.min(
          (width * 0.86) / (maxX - minX),
          (height * 0.86) / (maxY - minY),
        );
        const ox = (width - (maxX - minX) * scale) / 2 - minX * scale;
        const oy = (height - (maxY - minY) * scale) / 2 - minY * scale;
        const targets = bricks.map((b) => {
          const { px, py } = project(b.x, b.y, b.z, scale);
          return { tx: px + ox, ty: py + oy };
        });
        return { bricks, scale, targets };
      });
    }

    /** Pair existing pieces with the next model's bricks. */
    function retarget(modelIndex: number, staggerFrom: number) {
      const m = models[modelIndex];
      const order = m.bricks.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      const alive = pieces.filter((p) => !p.dying);
      const dying = pieces.filter((p) => p.dying);
      const next: Piece[] = [];
      const n = Math.max(alive.length, order.length);
      for (let i = 0; i < n; i++) {
        const p = alive[i];
        const bi = order[i];
        if (bi !== undefined) {
          const b = m.bricks[bi];
          const t = m.targets[bi];
          const activateAt =
            staggerFrom + b.z * 110 + (b.x + b.y) * 14 + Math.random() * 70;
          if (p) {
            next.push(
              Object.assign(p, {
                brick: b,
                scale: m.scale,
                tx: t.tx,
                ty: t.ty,
                alpha: 1,
                dying: false,
                activateAt,
              }),
            );
          } else {
            next.push({
              sx: Math.random() * width,
              sy: -40 - Math.random() * 120,
              vx: 0,
              vy: 0,
              tx: t.tx,
              ty: t.ty,
              brick: b,
              scale: m.scale,
              alpha: 1,
              dying: false,
              activateAt,
            });
          }
        } else if (p) {
          p.dying = true;
          p.vy -= 50;
          next.push(p);
        }
      }
      // Painter order: draw in the target model's brick order, debris last.
      next.sort(
        (a, b) =>
          (a.dying ? Infinity : m.bricks.indexOf(a.brick)) -
          (b.dying ? Infinity : m.bricks.indexOf(b.brick)),
      );
      pieces = [...next, ...dying];
    }

    function resize() {
      if (!canvas || !ctx || !container) return;
      width = container.clientWidth;
      height = Math.min(Math.round(width * 0.95), 500);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      computeModels();
      retarget(indexRef.current, performance.now());
      if (reduceMotion) drawStatic();
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height);
      for (const p of pieces) {
        if (p.dying) continue;
        drawPart(ctx!, p.brick, p.tx, p.ty, p.scale, 1);
      }
    }

    function frame(now: number) {
      if (disposed) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx!.clearRect(0, 0, width, height);

      const decay = Math.exp(-DRAG * dt);
      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        if (p.dying) {
          p.alpha -= dt * 2;
          if (p.alpha <= 0) {
            pieces.splice(i, 1);
            continue;
          }
        } else if (now >= p.activateAt) {
          // Breathing + spring toward the assembled position.
          const ty = p.ty + Math.sin(now * 0.0015 + p.tx * 0.012) * 1.3;
          p.vx += (p.tx - p.sx) * SPRING * dt;
          p.vy += (ty - p.sy) * SPRING * dt;
        }

        const dx = p.sx - mouse.x;
        const dy = p.sy - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < REPEL_RADIUS && d > 0.01) {
          const f = ((1 - d / REPEL_RADIUS) * REPEL_FORCE * dt) / d;
          p.vx += dx * f;
          p.vy += dy * f;
        }

        p.vx *= decay;
        p.vy *= decay;
        p.sx += p.vx * dt;
        p.sy += p.vy * dt;
      }
      for (const p of pieces) {
        drawPart(ctx!, p.brick, p.sx, p.sy, p.scale, p.alpha);
      }

      raf = visible ? requestAnimationFrame(frame) : 0;
    }

    function advance() {
      const now = performance.now();
      if (now - lastClick < EXPLODE_MS + 360) return;
      lastClick = now;

      const nextIndex = (indexRef.current + 1) % SCULPTURES.length;
      indexRef.current = nextIndex;
      setIndex(nextIndex);

      if (reduceMotion) {
        retarget(nextIndex, now);
        drawStatic();
        return;
      }

      for (const p of pieces) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 280 + Math.random() * 620;
        p.vx += Math.cos(angle) * speed;
        p.vy += Math.sin(angle) * speed;
      }
      morphTimer = setTimeout(() => {
        if (!disposed) retarget(nextIndex, performance.now() + 150);
      }, EXPLODE_MS);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onDown(e: PointerEvent) {
      e.stopPropagation(); // don't also drop a hero background brick
      advance();
    }

    resize();
    if (!reduceMotion) {
      const now = performance.now();
      for (const p of pieces) {
        p.sx = Math.random() * width;
        p.sy = -40 - Math.random() * 200;
        p.activateAt = now + 350 + (p.activateAt - now);
      }
      last = now;
      raf = requestAnimationFrame(frame);
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    canvas.addEventListener("pointerdown", onDown);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduceMotion) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    observer.observe(canvas);

    let lastWidth = container.clientWidth;
    const ro = new ResizeObserver(() => {
      if (container.clientWidth !== lastWidth) {
        lastWidth = container.clientWidth;
        resize();
      }
    });
    ro.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (morphTimer) clearTimeout(morphTimer);
      observer.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
    };
    // Engine manages its own state; runs once by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = SCULPTURES[index];

  return (
    <div>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`LEGO model: ${current.name}`}
        className="block w-full cursor-pointer"
      />
      <p
        key={index}
        className="word-flip mt-4 text-center font-mono text-xs text-lego-gray/70"
      >
        <span className="text-lego-yellow">
          {String(index + 1).padStart(2, "0")}/{SCULPTURES.length}
        </span>{" "}
        <span className="font-bold text-lego-gray">{current.name}</span> —{" "}
        {current.story}
        <span className="block pt-1 text-lego-gray/40">
          click it to rebuild
        </span>
      </p>
    </div>
  );
}
