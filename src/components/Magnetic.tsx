"use client";

import { useEffect, useRef } from "react";

/**
 * Makes its child drift gently toward the cursor and ease back on leave.
 * The offset is clamped, smoothed through an rAF lerp (no per-event
 * snapping), and measured against the element's untransformed center so
 * the button never chases its own displacement. Mouse-only; inert for
 * touch and reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.16,
  maxShift = 7,
}: {
  children: React.ReactNode;
  strength?: number;
  maxShift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let hovering = false;

    const tick = () => {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      if (!hovering && Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
        el.style.transform = "";
        raf = 0;
        return;
      }
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const clamp = (v: number) =>
      Math.max(-maxShift, Math.min(maxShift, v * strength));

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      // Subtract the current offset to recover the resting center —
      // otherwise the measurement feeds back into itself and wobbles.
      const centerX = rect.left + rect.width / 2 - x;
      const centerY = rect.top + rect.height / 2 - y;
      targetX = clamp(e.clientX - centerX);
      targetY = clamp(e.clientY - centerY);
      hovering = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      hovering = false;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength, maxShift]);

  return (
    <div ref={ref} className="magnetic inline-flex will-change-transform">
      {children}
    </div>
  );
}
