"use client";

import { useEffect, useRef, useState } from "react";
import { Brick, PileGrid, drawBrick, makeBrick, stepBricks } from "@/lib/lego";

const TYPED_TRIGGER = "lego";
const RAIN_INTERVAL = 160;
const MAX_PILE_RATIO = 0.5;

/**
 * Full-page easter egg: type "lego" anywhere (or run "Make it rain bricks"
 * from the ⌘K palette) and bricks rain over the page, piling up at the
 * bottom of the viewport. Click to drop more. Esc to clean up.
 */
export function BuildMode() {
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Activation: typed trigger + custom event from the palette.
  useEffect(() => {
    let buffer = "";
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-TYPED_TRIGGER.length);
      if (buffer === TYPED_TRIGGER) {
        buffer = "";
        setActive(true);
      }
    }
    const onEvent = () => setActive(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("lego:buildmode", onEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("lego:buildmode", onEvent);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(false);
      return;
    }

    let raf = 0;
    let width = 0;
    let height = 0;
    let last = performance.now();
    const bricks: Brick[] = [];
    const pile = new PileGrid();

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pile.resize(width);
    }

    function spawn(x: number, y: number) {
      if (pile.maxHeight() < height * MAX_PILE_RATIO) {
        bricks.push(makeBrick(x, y));
      }
    }

    const rainId = setInterval(
      () => spawn(Math.random() * width, -40),
      RAIN_INTERVAL,
    );

    function draw(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx!.clearRect(0, 0, width, height);
      stepBricks(bricks, pile, height, dt, now);
      for (const b of bricks) drawBrick(ctx!, b, now);
      raf = requestAnimationFrame(draw);
    }

    function onClick(e: PointerEvent) {
      spawn(e.clientX, Math.min(e.clientY, height * 0.3));
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(false);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onKey);
    canvas.addEventListener("pointerdown", onClick);
    raf = requestAnimationFrame(draw);

    return () => {
      clearInterval(rainId);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onClick);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <canvas ref={canvasRef} className="h-full w-full cursor-crosshair" />
      <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 rounded-sm bg-lego-black/90 px-4 py-2 text-center text-xs font-semibold text-white shadow-lg">
        Build mode — click to drop bricks
        <span className="ml-2 text-white/50">Esc to tidy up</span>
      </div>
      <button
        onClick={() => setActive(false)}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-sm bg-lego-red text-lg font-bold text-white shadow-lg transition-transform hover:scale-110"
        aria-label="Exit build mode"
      >
        ✕
      </button>
    </div>
  );
}
