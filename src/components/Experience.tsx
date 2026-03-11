import { SectionHeader } from "./SectionHeader";

const experiences = [
  {
    company: "Avokaado",
    role: "Applied AI Engineer",
    period: "Sep 2025 — Mar 2026",
    color: "bg-lego-red",
    dotColor: "bg-lego-red",
    description:
      "Legal tech startup building AI-powered contract automation. I owned the entire backend and AI pipeline — from document ingestion to agent orchestration — turning static legal documents into interactive, data-driven AI agents.",
    highlights: [
      "Designed a multi-stage AI pipeline — first extracting document structure and clauses, then building a data model of variables and fields, then generating business logic and decision rules",
      "Built stateful AI workflows with LangGraph for contract editing and review — orchestration with conversation tracking and tool calling",
      "Engineered PDF/DOCX processing with Docling and Azure Document Intelligence — including table detection, annex splitting, and placeholder mapping for deterministic LLM handling",
    ],
    tech: ["Python", "Flask", "SQLAlchemy", "LangChain", "LangGraph", "Docling", "Azure AI", "AWS"],
  },
  {
    company: "LHV Bank",
    role: "Software Developer — AI Focus",
    period: "Sep 2024 — Sep 2025",
    color: "bg-lego-blue",
    dotColor: "bg-lego-blue",
    description:
      "Came back to LHV because I loved working there the first time. Had an amazing senior architect to work with and learn from. Built AI tools that people across the bank actually used every day — not demos, real products.",
    highlights: [
      "Built a RAG chatbot that evolved from a regulatory tool into a generic plug-and-play platform — any team could create their own AI assistant from PDFs, webpages, and other resources, with integrations for Slack, Zendesk, and a standalone API",
      "The insurance team's \"Kindlustusguru\" was spun up with minimal effort thanks to the scalable architecture — won Project of the Year at LHV Summer Days",
      "Slack-integrated Delegator — AI routes incident reports to the right person instantly",
      "Built bank-wide SageMaker Studio environment for ML teams",
      "AWS AI Practitioner certification (Early Adopter, Jan 2025)",
    ],
    tech: ["Python", "AWS", "SageMaker", "Terraform", "RAG", "Slack API", "Kubernetes"],
  },
  {
    company: "Solutional",
    role: "Software Developer",
    period: "May 2024 — Aug 2024",
    color: "bg-lego-yellow",
    dotColor: "bg-lego-yellow",
    description:
      "Consultancy doing Java development. Practiced extreme programming and pair programming in a team environment.",
    highlights: [
      "Java development in a consultancy setting",
      "Extreme programming and pair programming practices",
    ],
    tech: ["Java"],
  },
  {
    company: "LHV Bank",
    role: "Full Stack Software Developer",
    period: "Jul 2023 — May 2024",
    color: "bg-lego-green",
    dotColor: "bg-lego-green",
    description:
      "My first real dev job. This is where I built the engineering fundamentals — Java, Angular, Kubernetes, production deployments for a bank that doesn't tolerate broken things. The foundation everything else was built on.",
    highlights: [
      "ERP Account Tracker — replaced a massive Excel with a web app used daily by treasury",
      "Business-critical data tracking LHV accounts at external banks — zero room for error",
      "Full stack: Java Spring backend, Angular frontend, Kubernetes deployment pipeline",
    ],
    tech: ["Java", "Angular", "Spring Boot", "Kubernetes"],
  },
];

export function Experience() {
  return (
    <section id="experience" className="bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Experience" color="bg-lego-red" />

        <div className="relative mt-12 space-y-12 pl-10">
          {/* Timeline line */}
          <div className="timeline-line" />

          {experiences.map((exp, i) => (
            <div key={i} className="relative">
              {/* Timeline dot */}
              <div
                className={`absolute -left-10 top-1 h-10 w-10 rounded-sm ${exp.dotColor} flex items-center justify-center shadow-md`}
              >
                <div className="h-3 w-3 rounded-full bg-white/80" />
              </div>

              <div className="brick bg-white p-6 shadow-md">
                <div className="brick-studs">
                  {[0, 1, 2].map((s) => (
                    <div key={s} className={`stud ${exp.color}`} />
                  ))}
                </div>

                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold text-foreground/60">
                      {exp.company}
                    </p>
                  </div>
                  <span className="rounded-sm bg-lego-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground/50">
                    {exp.period}
                  </span>
                </div>

                <p className="mb-4 text-foreground/70">{exp.description}</p>

                <ul className="mb-4 space-y-1">
                  {exp.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span
                        className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${exp.dotColor}`}
                      />
                      <span className="text-foreground/70">{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-sm bg-lego-light px-2 py-1 text-xs font-semibold text-foreground/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
