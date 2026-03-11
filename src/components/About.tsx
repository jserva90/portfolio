export function About() {
  return (
    <section id="about" className="bg-lego-light px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="About Me" color="bg-lego-blue" />

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Left column */}
          <div>
            <p className="mb-4 text-lg leading-relaxed text-foreground/80">
              I&apos;m an Applied AI Engineer with 3 years of experience
              building production systems that blend software engineering with
              AI. I graduated from <strong>kood/Jõhvi</strong> — completing
              their 2-year program in under 8 months, ranking in the top 5% out
              of 500+ students.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-foreground/80">
              At <strong>LHV Bank</strong> I built everything from internal
              tools to an award-winning RAG chatbot. At{" "}
              <strong>Avokaado</strong> I built AI-powered contract automation
              with LangChain agents. I&apos;m comfortable across the full stack
              — from Kubernetes deployments to LLM pipelines.
            </p>
            <p className="text-lg leading-relaxed text-foreground/80">
              I&apos;m a good listener, not afraid to speak my mind, and I bring
              a calm, creative energy to every team I join. I believe the best
              engineering comes from understanding the problem deeply before
              writing a single line of code.
            </p>
          </div>

          {/* Right column — quick facts */}
          <div className="grid grid-cols-2 gap-4">
            <FactBrick
              color="bg-lego-red"
              label="Location"
              value="Tallinn, Estonia"
            />
            <FactBrick
              color="bg-lego-blue"
              label="Experience"
              value="3 Years"
            />
            <FactBrick
              color="bg-lego-green"
              label="Focus"
              value="AI Engineering"
            />
            <FactBrick
              color="bg-lego-yellow"
              label="Status"
              value="Open to Work"
              textDark
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FactBrick({
  color,
  label,
  value,
  textDark = false,
}: {
  color: string;
  label: string;
  value: string;
  textDark?: boolean;
}) {
  return (
    <div className={`brick ${color} p-6 shadow-md`}>
      <div className="brick-studs">
        <div className={`stud ${color} brightness-90`} />
        <div className={`stud ${color} brightness-90`} />
      </div>
      <p
        className={`text-xs font-semibold uppercase tracking-wider ${textDark ? "text-foreground/60" : "text-white/70"}`}
      >
        {label}
      </p>
      <p
        className={`mt-1 text-xl font-bold ${textDark ? "text-foreground" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

export function SectionHeader({
  title,
  color,
}: {
  title: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className={`h-8 w-3 rounded-sm ${color}`} />
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
        {title}
      </h2>
    </div>
  );
}
