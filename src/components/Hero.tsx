import { BrickField } from "./BrickField";
import { BrickSculpture } from "./BrickSculpture";
import { Magnetic } from "./Magnetic";
import { RotatingWord } from "./RotatingWord";
import { HIDE_HERO_BRICK_DROP } from "@/lib/flags";

const NAME = "Joosep";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-lego-black px-6 pt-20">
      <BrickField />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[7fr_5fr]">
        <div>
          {/* Colored blocks accent */}
          <div className="mb-8 flex gap-2">
            {[
              ["w-16", "bg-lego-red", "0s"],
              ["w-10", "bg-lego-yellow", "0.08s"],
              ["w-20", "bg-lego-blue", "0.16s"],
              ["w-8", "bg-lego-green", "0.24s"],
            ].map(([w, color, delay]) => (
              <div
                key={color}
                className={`brick-letter h-4 ${w} rounded-sm ${color}`}
                style={{ animationDelay: delay }}
              />
            ))}
          </div>

          <p className="mb-4 font-mono text-sm font-medium uppercase tracking-widest text-lego-yellow">
            Software Engineer building{" "}
            <RotatingWord
              words={[
                "AI systems",
                "RAG platforms",
                "LLM agents",
                "things that ship",
              ]}
            />
          </p>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            Hi, I&apos;m{" "}
            <span aria-label={NAME} className="text-lego-yellow">
              {NAME.split("").map((letter, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="brick-letter"
                  style={{ animationDelay: `${0.25 + i * 0.07}s` }}
                >
                  {letter}
                </span>
              ))}
            </span>
            <br />
            <span className="text-lego-gray">Engineer first. AI second.</span>
          </h1>

          <p className="mb-6 max-w-2xl text-lg leading-relaxed text-lego-gray">
            I went from studying psychology to playing horn in the Defense Force
            orchestra to becoming a software engineer — and honestly, all of it
            helps. Understanding people is half the job. The other half is
            building things that actually work and knowing when AI is the right
            tool and when it isn&apos;t.
          </p>

          <p className="mb-10 max-w-2xl text-base leading-relaxed text-lego-gray/70">
            3 years across fintech and legal tech. Based in Tallinn. I speak
            Estonian, English, and Swedish. I&apos;m looking for a team that
            knows what it&apos;s building and why — where engineers build
            together with product people, not instead of them.
          </p>

          <div className="flex flex-wrap gap-4">
            <Magnetic>
              <a
                href="#experience"
                className="group inline-flex items-center gap-2 rounded-sm bg-lego-red px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(227,0,11,0.3)] transition-[background-color,box-shadow] duration-300 hover:bg-red-700 hover:shadow-[0_6px_24px_rgba(227,0,11,0.45)]"
              >
                View my work
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    d="M2 8h11M9.5 3.5 14 8l-4.5 4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="/cv"
                className="group inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-lego-black shadow-[0_4px_16px_rgba(255,255,255,0.12)] transition-[background-color,box-shadow] duration-300 hover:bg-lego-light hover:shadow-[0_6px_24px_rgba(255,255,255,0.2)]"
              >
                Download CV
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    d="M8 2v8m0 0 3.5-3.5M8 10 4.5 6.5M3 13.5h10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center rounded-sm border-2 border-lego-gray/30 px-6 py-3 text-sm font-bold uppercase tracking-wider text-lego-gray transition-colors duration-300 hover:border-lego-yellow/70 hover:text-white"
              >
                Get in touch
              </a>
            </Magnetic>
          </div>

          <p className="mt-16 text-xs text-lego-gray/50">
            Psst —{" "}
            {!HIDE_HERO_BRICK_DROP && <>click anywhere to drop a brick, or </>}
            press{" "}
            <kbd className="rounded-sm bg-white/10 px-1.5 py-0.5 font-mono font-bold text-lego-gray">
              ⌘K
            </kbd>{" "}
            to look around.
          </p>
        </div>

        {/* Five objects from my life, built in LEGO studs */}
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <BrickSculpture />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <svg
          className="scroll-hint h-5 w-5 text-lego-gray"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
