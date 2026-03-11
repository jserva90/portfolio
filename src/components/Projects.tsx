import { SectionHeader } from "./About";

export function Projects() {
  return (
    <section id="projects" className="bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Projects" color="bg-lego-yellow" />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Privahunt */}
          <div className="brick bg-white p-6 shadow-md">
            <div className="brick-studs">
              <div className="stud bg-lego-red" />
              <div className="stud bg-lego-red" />
            </div>

            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-lego-red">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <span className="rounded-sm bg-lego-light px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-foreground/50">
                Hackathon Winner
              </span>
            </div>

            <h3 className="text-xl font-bold text-foreground">Privahunt</h3>
            <p className="mt-1 text-sm text-foreground/50">
              kood/Jõhvi Cybersecurity Hackathon &middot; April 2023
            </p>

            <p className="mt-4 text-sm leading-relaxed text-foreground/70">
              Built a personal information gathering tool that uses AI to
              analyze publicly available data and assess its danger level.
              Developed in 48 hours with a team of four at the hackathon hosted
              by kood/Jõhvi and Startup Estonia.
            </p>

            <div className="mt-4 space-y-1">
              <Stat label="Result" value="Finals — won Tera VC mentoring" />
              <Stat label="Traction" value="100+ users in first 24 hours" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["React.js", "Go", "OpenAI API", "Cybersecurity"].map((t) => (
                <span
                  key={t}
                  className="rounded-sm border border-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Lovö Honung */}
          <div className="brick bg-white p-6 shadow-md">
            <div className="brick-studs">
              <div className="stud bg-lego-yellow" />
              <div className="stud bg-lego-yellow" />
            </div>

            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-lego-yellow">
                <svg
                  className="h-4 w-4 text-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="rounded-sm bg-lego-light px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-foreground/50">
                Real Impact
              </span>
            </div>

            <h3 className="text-xl font-bold text-foreground">Lovö Honung</h3>
            <p className="mt-1 text-sm text-foreground/50">
              Freelance project &middot; 2022
            </p>

            <p className="mt-4 text-sm leading-relaxed text-foreground/70">
              Built a website for a Swedish honey company that directly boosted
              their online presence and sales. Clean, effective web development
              with measurable business results.
            </p>

            <div className="mt-4 space-y-1">
              <Stat label="Impact" value="34% increase in sales" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["JavaScript", "HTML/CSS"].map((t) => (
                <span
                  key={t}
                  className="rounded-sm border border-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-semibold text-foreground/50">{label}:</span>
      <span className="text-foreground/80">{value}</span>
    </div>
  );
}
