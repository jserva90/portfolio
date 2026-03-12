import { SectionHeader } from "./SectionHeader";

const projects = [
  {
    title: "Legal Document AI Pipeline",
    company: "Avokaado",
    color: "bg-lego-red",
    tags: [
      "Multi-stage ingestion",
      "Structure extraction",
      "Variable modelling",
      "LLM orchestration",
      "LangGraph agents",
    ],
    description:
      "Designed a pipeline that turns complex legal documents into interactive AI agents — extracting structure, building data models, and generating business logic from PDFs and DOCX files.",
  },
  {
    title: "Enterprise RAG Platform",
    company: "LHV Bank",
    color: "bg-lego-blue",
    tags: [
      "OpenSearch retrieval",
      "Slack integration",
      "Standalone API",
      "Langfuse monitoring",
      "Plug-and-play architecture",
    ],
    description:
      "Built a generic RAG platform where any team could spin up their own AI assistant from documents and resources. The insurance team's bot was deployed with minimal effort and won Project of the Year.",
  },
  {
    title: "AI Incident Router",
    company: "LHV Bank",
    color: "bg-lego-green",
    tags: [
      "Slack integration",
      "AI classification",
      "Automated routing",
      "Real-time notifications",
    ],
    description:
      "Slack-integrated app that uses AI to analyze incoming problem reports and instantly route them to the right person — replacing manual triage across the organization.",
  },
];

export function SelectedWork() {
  return (
    <section id="work" className="bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Selected Work" color="bg-lego-yellow" />

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <div key={project.title} className="brick bg-white p-6 shadow-md">
              <div className="brick-studs">
                <div className={`stud ${project.color}`} />
                <div className={`stud ${project.color}`} />
              </div>

              <div className={`mb-4 h-1 w-12 rounded-full ${project.color}`} />

              <h3 className="text-lg font-bold text-foreground">
                {project.title}
              </h3>
              <p className="mb-3 text-xs font-semibold text-foreground/40">
                {project.company}
              </p>

              <p className="mb-4 text-sm leading-relaxed text-foreground/70">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm bg-lego-light px-2 py-1 text-xs font-semibold text-foreground/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
