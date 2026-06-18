"use client";

import { useEffect, useRef } from "react";
import { Brick, PileGrid, drawBrick, makeBrick, stepBricks } from "@/lib/lego";
import { HIDE_HERO_BRICK_DROP } from "@/lib/flags";

type Ripple = { x: number; y: number; born: number };

const GRID = 36;
const SPOTLIGHT = 200;
const MAX_BRICKS = 90;

/**
 * Interactive hero background: a field of LEGO studs that lights up around
 * the cursor and ripples on click — and every click drops a brick that
 * stacks into a wall at the bottom of the hero.
 */
export function BrickField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const mouse = { x: -9999, y: -9999 };
    const ripples: Ripple[] = [];
    let bricks: Brick[] = [];
    const pile = new PileGrid();

    function resize() {
      if (!canvas || !ctx || !section) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = section.clientWidth;
      height = section.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pile.resize(width);
      if (reduceMotion) drawStatic();
    }

    function drawStatic() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      for (let gx = GRID / 2; gx < width; gx += GRID) {
        for (let gy = GRID / 2; gy < height; gy += GRID) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function draw(now: number) {
      if (!ctx) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);

      // Stud grid with cursor spotlight + click ripples.
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (now - ripples[i].born > 1500) ripples.splice(i, 1);
      }
      for (let gx = GRID / 2; gx < width; gx += GRID) {
        for (let gy = GRID / 2; gy < height; gy += GRID) {
          const dMouse = Math.hypot(gx - mouse.x, gy - mouse.y);
          let glow = Math.max(0, 1 - dMouse / SPOTLIGHT) ** 2 * 0.35;
          for (const r of ripples) {
            const age = (now - r.born) / 1000;
            const ring = age * 420;
            const d = Math.abs(Math.hypot(gx - r.x, gy - r.y) - ring);
            glow += Math.exp(-(d * d) / (2 * 26 * 26)) * (1 - age / 1.5) * 0.6;
          }
          const a = 0.045 + Math.min(glow, 0.8);
          ctx.fillStyle =
            glow > 0.02
              ? `rgba(245,196,0,${a.toFixed(3)})`
              : `rgba(255,255,255,${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(gx, gy, glow > 0.1 ? 2.4 : 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      stepBricks(bricks, pile, height, dt, now);
      for (const b of bricks) drawBrick(ctx, b, now);

      raf = visible ? requestAnimationFrame(draw) : 0;
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function onDown(e: PointerEvent) {
      if (reduceMotion) return;
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripples.push({ x, y, born: performance.now() });
      // Brick dropping is gated off by default (the click still ripples).
      if (HIDE_HERO_BRICK_DROP) return;
      // Don't let the wall swallow the whole hero.
      if (bricks.length >= MAX_BRICKS || pile.maxHeight() > height * 0.45) {
        bricks = [];
        pile.reset();
      }
      bricks.push(makeBrick(x, Math.min(y, height * 0.4)));
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduceMotion) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    });
    observer.observe(section);

    const ro = new ResizeObserver(resize);
    ro.observe(section);
    resize();

    if (!reduceMotion) {
      section.addEventListener("pointermove", onMove, { passive: true });
      section.addEventListener("pointerleave", onLeave);
      section.addEventListener("pointerdown", onDown);
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      ro.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    />
  );
}
