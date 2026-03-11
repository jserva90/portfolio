"use client";

import { useState, useRef } from "react";

const links = [
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [fallen, setFallen] = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleLogoClick(e: React.MouseEvent) {
    e.preventDefault();
    if (fallen) return;

    const next = clicks + 1;
    setClicks(next);

    // Reset click count after 2s of no clicking
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setClicks(0), 2000);

    if (next >= 7) {
      setFallen(true);
      setTimeout(() => setFallen(false), 3000);
      setClicks(0);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-lego-black/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo — LEGO brick style */}
        <a href="#" className="flex items-center gap-2" onClick={handleLogoClick}>
          <div className={`flex gap-1 transition-transform duration-500 ${fallen ? "translate-y-1 -rotate-12" : ""}`}>
            <div className="h-3 w-3 rounded-full bg-lego-red" />
            <div className="h-3 w-3 rounded-full bg-lego-yellow" />
            <div className="h-3 w-3 rounded-full bg-lego-blue" />
            <div className="h-3 w-3 rounded-full bg-lego-green" />
          </div>
          <span
            className={`ml-1 text-lg font-bold tracking-tight text-white transition-all duration-700 ${fallen ? "translate-y-16 rotate-[30deg] opacity-0" : ""}`}
          >
            JS
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-lego-gray transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 px-6 py-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-lego-gray transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
