"use client";

import { useRef } from "react";

const MAX_TILT = 7; // degrees

/**
 * Wraps a card in a pointer-tracked 3D tilt with a moving sheen,
 * like picking up a LEGO brick and turning it in the light.
 * Inert on touch devices and under prefers-reduced-motion.
 */
export function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--tilt-x", `${((py - 0.5) * -2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${((px - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--sheen-x", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--sheen-y", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--sheen-o", "1");
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--sheen-o", "0");
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt-card ${className}`}
    >
      {children}
      <div aria-hidden="true" className="tilt-sheen" />
    </div>
  );
}
