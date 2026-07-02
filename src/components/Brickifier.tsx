"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Curated real-LEGO palette (BrickLink color names + hex).
const PALETTE: Array<{ name: string; hex: string }> = [
  { name: "White", hex: "#f4f4f4" },
  { name: "Light Bluish Gray", hex: "#a0a5a9" },
  { name: "Dark Bluish Gray", hex: "#6c6e68" },
  { name: "Black", hex: "#1b2a34" },
  { name: "Red", hex: "#c91a09" },
  { name: "Dark Red", hex: "#720e0f" },
  { name: "Coral", hex: "#ff698f" },
  { name: "Orange", hex: "#fe8a18" },
  { name: "Yellow", hex: "#f2cd37" },
  { name: "Tan", hex: "#e4cd9e" },
  { name: "Dark Tan", hex: "#958a73" },
  { name: "Reddish Brown", hex: "#582a12" },
  { name: "Lime", hex: "#bbe90b" },
  { name: "Bright Green", hex: "#4b9f4a" },
  { name: "Dark Green", hex: "#184632" },
  { name: "Sand Green", hex: "#a0bcac" },
  { name: "Medium Azure", hex: "#36aebf" },
  { name: "Medium Blue", hex: "#5a93db" },
  { name: "Blue", hex: "#0055bf" },
  { name: "Dark Blue", hex: "#0a3463" },
  { name: "Lavender", hex: "#e1d5ed" },
  { name: "Medium Lavender", hex: "#ac78ba" },
  { name: "Dark Purple", hex: "#3f3691" },
  { name: "Magenta", hex: "#923978" },
  { name: "Bright Pink", hex: "#e4adc8" },
];

const PRICE_PER_PIECE = 0.031; // € — typical 1x1 tile/plate average

/* ── Color math: sRGB → Lab, nearest-palette in perceptual space ── */
function srgbToLab(r: number, g: number, b: number): [number, number, number] {
  const lin = (c: number) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  // D65
  const x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = (t: number) =>
    t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const [fx, fy, fz] = [f(x), f(y), f(z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const PALETTE_RGB = PALETTE.map((p) => hexToRgb(p.hex));
const PALETTE_LAB = PALETTE_RGB.map(([r, g, b]) => srgbToLab(r, g, b));

function nearestColor(r: number, g: number, b: number): number {
  const [L, A, B2] = srgbToLab(r, g, b);
  let best = 0;
  let bestD = Infinity;
  // Chroma weighted 1.7×: neutral areas must map to grays/tans, never to
  // pink or teal specks — the classic limited-palette dithering artifact.
  const W = 1.7;
  for (let i = 0; i < PALETTE_LAB.length; i++) {
    const [l2, a2, b2] = PALETTE_LAB[i];
    const d = (L - l2) ** 2 + (W * (A - a2)) ** 2 + (W * (B2 - b2)) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

type View = "mosaic" | "relief";

/**
 * The Brickifier: turns any image into a LEGO mosaic, entirely in the
 * browser. Downscale → Lab-space quantization to the real LEGO palette
 * (optional Floyd–Steinberg dithering) → flat LEGO-Art mosaic or a 3D
 * isometric relief where brightness becomes brick height.
 */
export function Brickifier() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [grid, setGrid] = useState(48);
  const [dither, setDither] = useState(true);
  const [view, setView] = useState<View>("mosaic");
  const [cells, setCells] = useState<Uint8Array | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }, []);

  /* ── Quantize: image → grid of palette indices ── */
  useEffect(() => {
    if (!img) return;
    const off = document.createElement("canvas");
    off.width = grid;
    off.height = grid;
    const ctx = off.getContext("2d")!;
    // Cover-crop to a square so faces aren't squished.
    const s = Math.min(img.width, img.height);
    ctx.drawImage(
      img,
      (img.width - s) / 2,
      (img.height - s) / 2,
      s,
      s,
      0,
      0,
      grid,
      grid,
    );
    const data = ctx.getImageData(0, 0, grid, grid).data;

    // Float copy for error diffusion.
    const px = new Float32Array(grid * grid * 3);
    for (let i = 0; i < grid * grid; i++) {
      px[i * 3] = data[i * 4];
      px[i * 3 + 1] = data[i * 4 + 1];
      px[i * 3 + 2] = data[i * 4 + 2];
    }

    const out = new Uint8Array(grid * grid);
    const clampErr = (e: number) => Math.max(-40, Math.min(40, e)) * 0.72;
    for (let y = 0; y < grid; y++) {
      // Serpentine scan: alternate direction per row so diffusion worms
      // don't drift diagonally across the image.
      const ltr = y % 2 === 0;
      for (let xi = 0; xi < grid; xi++) {
        const x = ltr ? xi : grid - 1 - xi;
        const dir = ltr ? 1 : -1;
        const i = y * grid + x;
        const r = Math.max(0, Math.min(255, px[i * 3]));
        const g = Math.max(0, Math.min(255, px[i * 3 + 1]));
        const b = Math.max(0, Math.min(255, px[i * 3 + 2]));
        const idx = nearestColor(r, g, b);
        out[i] = idx;
        if (dither) {
          // Floyd–Steinberg, damped + clamped: full-strength diffusion on
          // a 25-color palette sprays confetti into smooth areas.
          const [pr, pg, pb] = PALETTE_RGB[idx];
          const er = clampErr(r - pr);
          const eg = clampErr(g - pg);
          const eb = clampErr(b - pb);
          const spread = (dx: number, dy: number, w: number) => {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || nx >= grid || ny >= grid) return;
            const j = (ny * grid + nx) * 3;
            px[j] += (er * w) / 16;
            px[j + 1] += (eg * w) / 16;
            px[j + 2] += (eb * w) / 16;
          };
          spread(dir, 0, 7);
          spread(-dir, 1, 3);
          spread(0, 1, 5);
          spread(dir, 1, 1);
        }
      }
    }
    setCells(out);
  }, [img, grid, dither]);

  /* ── Render the mosaic view (the 3D relief is WebGL, below) ── */
  useEffect(() => {
    if (view !== "mosaic") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !cells) return;

    // Derive the grid from the data itself so a resolution change can
    // never index stale cells with the new size.
    const n = Math.round(Math.sqrt(cells.length));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = 820;
    canvas.width = W * dpr;
    canvas.height = W * dpr;
    canvas.style.width = "100%";
    canvas.style.aspectRatio = "1";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#0e0e16";
    ctx.fillRect(0, 0, W, W);

    // Flat LEGO-Art render: gapped square tile + round stud with lighting.
    const cell = (W - 40) / n;
    const gap = Math.max(0.75, cell * 0.045);
    const ox = 20;
    const oy = 20;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const hex = PALETTE[cells[y * n + x]].hex;
        const cx = ox + x * cell;
        const cy = oy + y * cell;
        ctx.fillStyle = hex;
        ctx.fillRect(cx + gap, cy + gap, cell - gap * 2, cell - gap * 2);
        const r = cell * 0.33;
        ctx.fillStyle = "rgba(0,0,0,0.16)";
        ctx.beginPath();
        ctx.arc(cx + cell / 2 + r * 0.12, cy + cell / 2 + r * 0.12, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = hex;
        ctx.beginPath();
        ctx.arc(cx + cell / 2, cy + cell / 2, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(cx + cell / 2 - r * 0.25, cy + cell / 2 - r * 0.25, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [cells, view]);

  /* ── Parts list ── */
  const parts = useMemo(() => {
    if (!cells) return null;
    const counts = new Map<number, number>();
    for (const c of cells) counts.set(c, (counts.get(c) ?? 0) + 1);
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    return {
      total: cells.length,
      colors: sorted.map(([i, n]) => ({ ...PALETTE[i], count: n })),
      price: cells.length * PRICE_PER_PIECE,
    };
  }, [cells]);

  const exportPng = useCallback(() => {
    const canvas =
      view === "relief"
        ? document.querySelector<HTMLCanvasElement>("#relief3d canvas")
        : canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `lego-${view}-${grid}x${grid}.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, "image/png");
  }, [view, grid]);

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-28">
      <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
        The Brickifier
      </h1>
      <p className="mt-3 max-w-2xl text-lego-gray">
        Turn any picture into a LEGO mosaic — flat like a LEGO Art set, or as
        a 3D brick relief. Everything runs in your browser:{" "}
        <span className="font-semibold text-lego-yellow">
          your photo never leaves this page.
        </span>
      </p>

      {/* Dropzone / controls */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_260px]">
        <div>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) loadFile(f);
            }}
            className={`flex cursor-pointer items-center justify-center rounded-sm border-2 border-dashed px-6 py-5 text-sm font-semibold transition-colors ${
              dragOver
                ? "border-lego-yellow bg-lego-yellow/10 text-lego-yellow"
                : "border-lego-gray/30 text-lego-gray hover:border-lego-yellow/60 hover:text-white"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) loadFile(f);
              }}
            />
            {img ? "Drop another image, or click to choose" : "Drop an image here, or click to choose one"}
          </label>

          {/* Canvas */}
          <div className="mt-4 overflow-hidden rounded-sm border border-white/10 bg-[#14141f]">
            {cells ? (
              view === "mosaic" ? (
                <canvas ref={canvasRef} className="block w-full" />
              ) : (
                <Relief3D cells={cells} />
              )
            ) : (
              <div className="flex aspect-square items-center justify-center text-sm text-lego-gray/50">
                Your mosaic will appear here
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-5">
          <Control label="View">
            <div className="flex gap-2">
              {(
                [
                  ["mosaic", "Mosaic"],
                  ["relief", "3D relief"],
                ] as Array<[View, string]>
              ).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    view === v
                      ? "bg-lego-yellow text-lego-black"
                      : "bg-white/10 text-lego-gray hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Control>

          <Control label="Resolution">
            <div className="flex gap-2">
              {[32, 48, 64].map((g) => (
                <button
                  key={g}
                  onClick={() => setGrid(g)}
                  className={`rounded-sm px-3 py-1.5 font-mono text-xs font-bold transition-colors ${
                    grid === g
                      ? "bg-lego-blue text-white"
                      : "bg-white/10 text-lego-gray hover:text-white"
                  }`}
                >
                  {g}×{g}
                </button>
              ))}
            </div>
          </Control>

          <Control label="Dithering">
            <button
              onClick={() => setDither(!dither)}
              className={`rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                dither
                  ? "bg-lego-green text-white"
                  : "bg-white/10 text-lego-gray hover:text-white"
              }`}
            >
              {dither ? "On — detailed" : "Off — flat colors"}
            </button>
          </Control>

          {parts && (
            <>
              <div className="rounded-sm border border-white/10 bg-white/5 p-4">
                <p className="font-mono text-xs uppercase tracking-widest text-lego-gray">
                  If you built it for real
                </p>
                <p className="font-display mt-2 text-3xl font-extrabold text-white">
                  {parts.total.toLocaleString()}{" "}
                  <span className="text-base text-lego-gray">pieces</span>
                </p>
                <p className="mt-1 text-sm text-lego-gray">
                  {parts.colors.length} colors · ~€
                  {parts.price.toFixed(0)} in 1×1 tiles
                </p>
                <div className="mt-3 max-h-44 space-y-1.5 overflow-y-auto pr-1">
                  {parts.colors.map((c) => (
                    <div key={c.hex} className="flex items-center gap-2 text-xs">
                      <span
                        className="h-3.5 w-3.5 shrink-0 rounded-[3px] border border-white/20"
                        style={{ background: c.hex }}
                      />
                      <span className="flex-1 truncate text-lego-gray">
                        {c.name}
                      </span>
                      <span className="font-mono text-lego-gray/70">
                        ×{c.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={exportPng}
                className="w-full rounded-sm bg-lego-red px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
              >
                Download PNG
              </button>
            </>
          )}
        </div>
      </div>

      <p className="mt-10 max-w-2xl text-xs leading-relaxed text-lego-gray/50">
        How it works: the image is center-cropped and downscaled to the grid,
        then each pixel is matched to the nearest of {PALETTE.length} real
        LEGO colors in CIELAB space (perceptual distance, not raw RGB), with
        optional Floyd–Steinberg error diffusion. The 3D relief maps
        brightness to brick height and renders through the same isometric
        engine as the sculptures on the front page.
      </p>
    </div>
  );
}

function Control({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-lego-gray">
        {label}
      </p>
      {children}
    </div>
  );
}

/**
 * WebGL relief: every cell becomes a real 3D brick column (instanced,
 * so 64×64 = 4096 bricks + studs render in two draw calls). Click-drag
 * orbits it in any direction, scroll zooms, and it slowly spins when idle.
 */
function Relief3D({ cells }: { cells: Uint8Array }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const n = Math.round(Math.sqrt(cells.length));
    const W = mount.clientWidth || 820;
    const H = Math.round(W * 0.78);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true, // for PNG export
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "none";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.5, n * 12);
    scene.add(new THREE.HemisphereLight(0xf1ecff, 0x22222e, 1.1));
    const key = new THREE.DirectionalLight(0xfff2dd, 1.5);
    key.position.set(1, 2.2, 1.2);
    scene.add(key);

    const MAX_H = 6;
    const brickGeo = new THREE.BoxGeometry(0.94, 1, 0.94);
    const studGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.18, 12);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.45 });
    const bricks = new THREE.InstancedMesh(brickGeo, mat, n * n);
    const studs = new THREE.InstancedMesh(studGeo, mat.clone(), n * n);
    const m = new THREE.Matrix4();
    const col = new THREE.Color();
    for (let z = 0; z < n; z++) {
      for (let x = 0; x < n; x++) {
        const i = z * n + x;
        const [r, g, b] = PALETTE_RGB[cells[i]];
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        const h = 0.6 + lum * (MAX_H - 0.6);
        m.makeScale(1, h, 1);
        m.setPosition(x - n / 2 + 0.5, h / 2, z - n / 2 + 0.5);
        bricks.setMatrixAt(i, m);
        m.makeScale(1, 1, 1);
        m.setPosition(x - n / 2 + 0.5, h + 0.09, z - n / 2 + 0.5);
        studs.setMatrixAt(i, m);
        col.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
        bricks.setColorAt(i, col);
        studs.setColorAt(i, col);
      }
    }
    scene.add(bricks, studs);

    // Minimal orbit: drag = yaw/pitch, wheel = zoom, idle = slow spin.
    let yaw = 0.8;
    let pitch = 0.55;
    let dist = n * 1.7;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const el = renderer.domElement;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      yaw -= (e.clientX - lastX) * 0.006;
      pitch = Math.max(-0.4, Math.min(1.35, pitch + (e.clientY - lastY) * 0.005));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
      el.style.cursor = "grab";
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      dist = Math.max(n * 0.7, Math.min(n * 3.5, dist * (1 + e.deltaY * 0.001)));
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    let raf = 0;
    const loop = () => {
      if (!dragging) yaw += 0.0012;
      camera.position.set(
        Math.sin(yaw) * Math.cos(pitch) * dist,
        Math.sin(pitch) * dist + MAX_H * 0.5,
        Math.cos(yaw) * Math.cos(pitch) * dist,
      );
      camera.lookAt(0, MAX_H * 0.4, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
      brickGeo.dispose();
      studGeo.dispose();
      mat.dispose();
      (studs.material as THREE.Material).dispose();
      renderer.dispose();
      mount.removeChild(el);
    };
  }, [cells]);

  return (
    <div id="relief3d">
      <div ref={mountRef} className="w-full" />
      <p className="pb-3 text-center font-mono text-[11px] text-lego-gray/60">
        drag to spin · scroll to zoom
      </p>
    </div>
  );
}
