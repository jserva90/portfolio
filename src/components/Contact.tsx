import { SectionHeader } from "./SectionHeader";

export function Contact() {
  return (
    <section id="contact" className="bg-lego-black px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-4">
          <div className="h-8 w-3 rounded-sm bg-lego-yellow" />
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Let&apos;s Connect
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-6 text-lg leading-relaxed text-lego-gray">
              I&apos;m open to new opportunities — software engineering, AI
              engineering, or anything where I get to build things with good
              people. Based in Tallinn, happy to work remote.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-lego-gray">
              I&apos;m easy to talk to. Drop me a message and let&apos;s see if
              there&apos;s a fit.
            </p>
            <p className="mb-8 rounded-sm bg-white/10 px-4 py-3 text-sm text-lego-yellow">
              Available from April 2026
            </p>

            <div className="space-y-4">
              <ContactLink
                color="bg-lego-blue"
                label="LinkedIn"
                href="https://www.linkedin.com/in/joosep-serva-65b069221/"
                display="linkedin.com/in/joosep-serva"
              />
              <ContactLink
                color="bg-lego-red"
                label="Email"
                href="mailto:joosepserva@gmail.com"
                display="joosepserva@gmail.com"
              />
              <ContactLink
                color="bg-lego-green"
                label="GitHub"
                href="https://github.com/jserva90"
                display="github.com/jserva90"
              />
            </div>
          </div>

          {/* Decorative brick stack */}
          <div className="hidden items-end justify-center md:flex">
            <div className="space-y-1">
              {[
                { w: "w-48", color: "bg-lego-red" },
                { w: "w-56", color: "bg-lego-blue" },
                { w: "w-64", color: "bg-lego-yellow" },
                { w: "w-72", color: "bg-lego-green" },
                { w: "w-80", color: "bg-lego-red" },
              ].map((brick, i) => (
                <div
                  key={i}
                  className={`${brick.w} ${brick.color} flex h-10 items-center gap-3 rounded-sm px-4 opacity-20`}
                >
                  <div className="h-4 w-4 rounded-full bg-white/30" />
                  <div className="h-4 w-4 rounded-full bg-white/30" />
                  <div className="h-4 w-4 rounded-full bg-white/30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({
  color,
  label,
  href,
  display,
}: {
  color: string;
  label: string;
  href: string;
  display: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 transition-transform hover:translate-x-1"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-sm ${color}`}
      >
        <span className="text-xs font-bold text-white">
          {label.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-sm text-lego-gray">{display}</p>
      </div>
    </a>
  );
}
