import Link from "next/link";

const RED = "#e3000b";
const YELLOW = "#f5c400";
const BLUE = "#006db7";
const GREEN = "#00852b";

// A brick wall with one piece missing — this page.
const WALL: Array<Array<{ w: number; c: string } | { gap: number }>> = [
  [{ w: 3, c: BLUE }, { w: 2, c: RED }, { w: 3, c: GREEN }],
  [{ w: 2, c: YELLOW }, { gap: 3 }, { w: 3, c: BLUE }],
  [{ w: 3, c: RED }, { w: 3, c: GREEN }, { w: 2, c: YELLOW }],
];

function Stud() {
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-white/30" />;
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-lego-black px-6 text-center">
      {/* The wall */}
      <div className="mb-10 flex flex-col items-center gap-1">
        {WALL.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map((piece, pi) =>
              "gap" in piece ? (
                <div
                  key={pi}
                  className="flex h-7 items-center justify-center rounded-[3px] border-2 border-dashed border-lego-yellow/50"
                  style={{ width: piece.gap * 30 }}
                >
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-lego-yellow/60">
                    404
                  </span>
                </div>
              ) : (
                <div
                  key={pi}
                  className="flex h-7 items-center justify-evenly rounded-[3px] px-1.5"
                  style={{ width: piece.w * 30, background: piece.c }}
                >
                  {Array.from({ length: piece.w }).map((_, i) => (
                    <Stud key={i} />
                  ))}
                </div>
              ),
            )}
          </div>
        ))}
      </div>

      <h1 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl">
        This page is a missing piece
      </h1>

      <p className="mt-6 max-w-md text-lg leading-relaxed text-lego-gray">
        You&apos;re lost. That&apos;s okay. I went from psychology to French
        horn to the military to software engineering. Detours are kind of my
        thing.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center rounded-sm bg-lego-red px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
        >
          Back to safety
        </Link>
        <Link
          href="/brickify"
          className="inline-flex items-center rounded-sm border-2 border-lego-gray/30 px-6 py-3 text-sm font-bold uppercase tracking-wider text-lego-gray transition-colors hover:border-lego-yellow/70 hover:text-white"
        >
          Build something instead
        </Link>
      </div>

      <p className="mt-12 font-mono text-xs text-lego-gray/40">
        Error 404 — piece not included in this set
      </p>
    </div>
  );
}
