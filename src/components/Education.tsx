import { SectionHeader } from "./SectionHeader";

export function Education() {
  return (
    <section id="education" className="bg-lego-light px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Education" color="bg-lego-blue" />

        <div className="mt-12 space-y-6">
          {/* kood/Jõhvi */}
          <div className="brick bg-white p-8 shadow-md">
            <div className="brick-studs">
              <div className="stud bg-lego-blue" />
              <div className="stud bg-lego-blue" />
              <div className="stud bg-lego-blue" />
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground">
                  kood/Jõhvi
                </h3>
                <p className="mt-1 text-sm font-semibold text-foreground/60">
                  Computer Programming &middot; 2022 — 2023
                </p>
                <p className="mt-4 text-foreground/70">
                  No teachers, no lectures — just you and the projects. Based on
                  the 42 school model. I loved it. Went through the entire
                  curriculum (Go, JavaScript, React, Python, full stack) at full
                  speed and never looked back.
                </p>

                {/* Privahunt highlight */}
                <div className="mt-4 rounded-sm border-l-4 border-lego-red bg-lego-light px-4 py-3">
                  <p className="text-sm font-bold text-foreground">
                    Privahunt — Cybersecurity Hackathon
                  </p>
                  <p className="mt-1 text-sm text-foreground/60">
                    Built an AI-powered personal info gathering tool in 48
                    hours with a team of four. Made the finals, won Tera VC
                    mentoring. 100+ users in the first 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-4 md:flex-col md:gap-3">
                <div className="rounded-sm bg-lego-yellow px-5 py-4 text-center shadow-sm">
                  <p className="text-2xl font-extrabold text-foreground">
                    Top 5%
                  </p>
                  <p className="text-xs font-semibold text-foreground/60">
                    of 500+ students
                  </p>
                </div>
                <div className="rounded-sm bg-lego-red px-5 py-4 text-center shadow-sm">
                  <p className="text-2xl font-extrabold text-white">
                    &lt; 8 mo
                  </p>
                  <p className="text-xs font-semibold text-white/70">
                    completed 2yr program
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The interesting backstory */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="brick bg-white p-6 shadow-md">
              <div className="brick-studs">
                <div className="stud bg-lego-green" />
                <div className="stud bg-lego-green" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Music &amp; Theatre Academy
              </h3>
              <p className="mt-1 text-sm text-foreground/60">
                BA, Horn &middot; 2019 — 2022
              </p>
              <p className="mt-3 text-sm text-foreground/50">
                Yes, I played French horn professionally. Co Principal Horn in
                the Estonian Defense Force orchestra. Turns out orchestra
                training teaches you discipline, precision, and how to perform
                under pressure — all useful in engineering.
              </p>
            </div>

            <div className="brick bg-white p-6 shadow-md">
              <div className="brick-studs">
                <div className="stud bg-lego-yellow" />
                <div className="stud bg-lego-yellow" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Psychology</h3>
              <p className="mt-1 text-sm text-foreground/60">
                BSc, Clinical &middot; 2010 — 2014
              </p>
              <p className="mt-3 text-sm text-foreground/50">
                Before code, I studied how people think. It gave me the habit of
                asking &ldquo;what does the user actually need?&rdquo; before
                jumping to solutions. I still use this every day.
              </p>
            </div>

            <div className="brick bg-white p-6 shadow-md">
              <div className="brick-studs">
                <div className="stud bg-lego-red" />
                <div className="stud bg-lego-red" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Languages</h3>
              <div className="mt-3 space-y-2">
                {[
                  { lang: "Estonian", level: "Native" },
                  { lang: "English", level: "Professional" },
                  { lang: "Swedish", level: "Professional" },
                ].map((l) => (
                  <div key={l.lang} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-lego-blue" />
                    <span className="text-sm font-medium text-foreground/70">
                      {l.lang}
                    </span>
                    <span className="text-xs text-foreground/40">
                      {l.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
