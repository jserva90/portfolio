import { HIDE_BUILD_MODE } from "@/lib/flags";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-lego-black px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-lego-red" />
            <div className="h-2 w-2 rounded-full bg-lego-yellow" />
            <div className="h-2 w-2 rounded-full bg-lego-blue" />
            <div className="h-2 w-2 rounded-full bg-lego-green" />
          </div>
          <span className="text-sm text-lego-gray">
            Joosep Serva &copy; {new Date().getFullYear()}
          </span>
        </div>
        <p className="text-xs text-lego-gray/60">
          Built brick by brick with Next.js · press{" "}
          <kbd className="rounded-sm bg-white/10 px-1 py-0.5 font-mono font-bold">
            ⌘K
          </kbd>
          {!HIDE_BUILD_MODE && (
            <>
              {" "}
              or type{" "}
              <span className="font-semibold text-lego-yellow/70">lego</span>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
