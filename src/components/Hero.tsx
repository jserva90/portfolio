export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-lego-black px-6 pt-20">
      {/* Background decorative studs */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Colored blocks accent */}
        <div className="mb-8 flex gap-2">
          <div className="h-4 w-16 rounded-sm bg-lego-red" />
          <div className="h-4 w-10 rounded-sm bg-lego-yellow" />
          <div className="h-4 w-20 rounded-sm bg-lego-blue" />
          <div className="h-4 w-8 rounded-sm bg-lego-green" />
        </div>

        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-lego-yellow">
          Software Engineer building AI systems
        </p>

        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
          Hi, I&apos;m{" "}
          <span className="text-lego-yellow">Joosep</span>
          <br />
          <span className="text-lego-gray">
            Engineer first. AI second.
          </span>
        </h1>

        <p className="mb-6 max-w-2xl text-lg leading-relaxed text-lego-gray">
          I went from studying psychology to playing horn in the Defense Force
          orchestra to becoming a software engineer — and honestly, all of it
          helps. Understanding people is half the job. The other half is building
          things that actually work and knowing when AI is the right tool and
          when it isn&apos;t.
        </p>

        <p className="mb-10 max-w-2xl text-base leading-relaxed text-lego-gray/70">
          3 years across fintech and legal tech. Based in Tallinn. I speak
          Estonian, English, and Swedish. I&apos;m looking for a team that knows
          what it&apos;s building and why — where engineers build together with
          product people, not instead of them.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#experience"
            className="inline-flex items-center rounded-sm bg-lego-red px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
          >
            View my work
          </a>
          <a
            href="/cv"
            className="inline-flex items-center rounded-sm bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-lego-black transition-colors hover:bg-lego-light"
          >
            Download CV
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-sm border-2 border-lego-gray/30 px-6 py-3 text-sm font-bold uppercase tracking-wider text-lego-gray transition-colors hover:border-white hover:text-white"
          >
            Get in touch
          </a>
        </div>

        {/* Bottom brick row */}
        <div className="mt-20 flex gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="h-2 flex-1 rounded-sm"
              style={{
                backgroundColor: ["#e3000b", "#006db7", "#f5c400", "#00852b"][
                  i % 4
                ],
                opacity: 0.6 - i * 0.025,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
