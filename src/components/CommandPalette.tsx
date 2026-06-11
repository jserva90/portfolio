"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Command = {
  id: string;
  label: string;
  group: "Navigate" | "Links" | "Fun";
  keywords: string;
  color: string;
  run: () => void;
};

const EMAIL = "joosepserva@gmail.com";

function buildCommands(close: () => void, copyEmail: () => void): Command[] {
  const go = (id: string) => () => {
    close();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const open = (url: string) => () => {
    close();
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return [
    { id: "experience", label: "Go to Experience", group: "Navigate", keywords: "work jobs avokaado lhv career", color: "bg-lego-red", run: go("experience") },
    { id: "work", label: "Go to Selected Work", group: "Navigate", keywords: "projects rag pipeline portfolio", color: "bg-lego-yellow", run: go("work") },
    { id: "education", label: "Go to Education", group: "Navigate", keywords: "school kood johvi music psychology", color: "bg-lego-blue", run: go("education") },
    { id: "contact", label: "Go to Contact", group: "Navigate", keywords: "email hire reach out connect", color: "bg-lego-green", run: go("contact") },
    {
      id: "cv",
      label: "Open CV",
      group: "Links",
      keywords: "resume download pdf print",
      color: "bg-lego-red",
      run: () => {
        close();
        window.location.href = "/cv";
      },
    },
    { id: "github", label: "Open GitHub", group: "Links", keywords: "code repos jserva90", color: "bg-lego-black", run: open("https://github.com/jserva90") },
    { id: "linkedin", label: "Open LinkedIn", group: "Links", keywords: "profile network", color: "bg-lego-blue", run: open("https://www.linkedin.com/in/joosep-serva-65b069221/") },
    { id: "email", label: "Copy email address", group: "Links", keywords: `mail ${EMAIL}`, color: "bg-lego-yellow", run: copyEmail },
    {
      id: "bricks",
      label: "Make it rain bricks",
      group: "Fun",
      keywords: "lego build mode easter egg play physics",
      color: "bg-lego-green",
      run: () => {
        close();
        window.dispatchEvent(new CustomEvent("lego:buildmode"));
      },
    },
    {
      id: "hype",
      label: "Pitch me ThoughtLeaderAI",
      group: "Fun",
      keywords: "ai hype startup easter egg buzzword",
      color: "bg-lego-red",
      run: () => {
        close();
        // The AI easter egg listens for the typed sequence "ai".
        for (const key of ["a", "i"]) {
          window.dispatchEvent(new KeyboardEvent("keydown", { key }));
        }
      },
    },
  ];
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelected(0);
    setCopied(false);
  }, []);

  const copyEmail = useCallback(() => {
    navigator.clipboard?.writeText(EMAIL).catch(() => {});
    setCopied(true);
    setTimeout(close, 900);
  }, [close]);

  const commands = useMemo(
    () => buildCommands(close, copyEmail),
    [close, copyEmail],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.keywords}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Global shortcuts: ⌘K / Ctrl+K toggles, plus a custom event for the nav button.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    }
    const onOpen = () => setIsOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("lego:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("lego:palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => setSelected(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${selected}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[selected]?.run();
    } else if (e.key === "Escape") {
      close();
    }
  }

  if (!isOpen) return null;

  let lastGroup = "";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-lego-black/60 px-4 pt-[18vh] backdrop-blur-sm"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="palette-pop relative w-full max-w-lg rounded-md bg-white shadow-2xl"
      >
        {/* Studs on top — it's a brick, after all */}
        <div className="absolute -top-[7px] left-5 flex gap-2" aria-hidden="true">
          {["bg-lego-red", "bg-lego-yellow", "bg-lego-blue", "bg-lego-green"].map(
            (c) => (
              <div key={c} className={`h-[7px] w-4 rounded-t-md ${c} opacity-90`} />
            ),
          )}
        </div>

        <div className="flex items-center gap-3 border-b border-lego-black/10 px-5 py-4">
          <svg className="h-4 w-4 shrink-0 text-lego-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Type a command or search…"
            aria-label="Search commands"
            className="w-full bg-transparent text-base text-lego-black outline-none placeholder:text-lego-black/30"
          />
          <kbd className="rounded-sm bg-lego-light px-1.5 py-0.5 font-mono text-[10px] font-bold text-lego-black/40">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[40vh] overflow-y-auto p-2">
          {copied ? (
            <p className="px-3 py-6 text-center text-sm font-semibold text-lego-green">
              Copied {EMAIL} to clipboard ✓
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-lego-black/40">
              Nothing found. Those bricks don&apos;t click.
            </p>
          ) : (
            results.map((cmd, i) => {
              const showGroup = cmd.group !== lastGroup;
              lastGroup = cmd.group;
              return (
                <div key={cmd.id}>
                  {showGroup && (
                    <p className="px-3 pb-1 pt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-lego-black/30">
                      {cmd.group}
                    </p>
                  )}
                  <button
                    data-index={i}
                    onClick={cmd.run}
                    onPointerMove={() => setSelected(i)}
                    className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      i === selected
                        ? "bg-lego-light text-lego-black"
                        : "text-lego-black/70"
                    }`}
                  >
                    <span
                      className={`h-3 w-3 shrink-0 rounded-[2px] ${cmd.color}`}
                      aria-hidden="true"
                    />
                    {cmd.label}
                    {i === selected && (
                      <span className="ml-auto text-[10px] font-bold text-lego-black/30">
                        ↵
                      </span>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-lego-black/10 px-5 py-2.5 text-[11px] text-lego-black/40">
          <span><kbd className="font-mono font-bold">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono font-bold">↵</kbd> select</span>
          <span className="ml-auto">built brick by brick</span>
        </div>
      </div>
    </div>
  );
}
