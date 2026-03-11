import { SectionHeader } from "./About";

const skillGroups = [
  {
    title: "AI & ML",
    color: "bg-lego-red",
    skills: [
      "LangChain",
      "RAG Systems",
      "LLM Pipelines",
      "Agentic AI",
      "Prompt Engineering",
      "SageMaker",
    ],
  },
  {
    title: "Backend",
    color: "bg-lego-blue",
    skills: ["Python", "Java", "Node.js", "Spring Boot", "FastAPI", "REST APIs"],
  },
  {
    title: "Cloud & DevOps",
    color: "bg-lego-green",
    skills: [
      "AWS (Certified)",
      "Kubernetes",
      "Docker",
      "CI/CD",
      "SageMaker Studio",
      "Infrastructure as Code",
    ],
  },
  {
    title: "Frontend & Tools",
    color: "bg-lego-yellow",
    skills: [
      "Angular",
      "React / Next.js",
      "TypeScript",
      "Google Docs API",
      "Slack API",
      "Git",
    ],
  },
];

export function Skills() {
  return (
    <section id="skills" className="bg-lego-light px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="Skills" color="bg-lego-green" />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div key={group.title} className="brick bg-white p-6 shadow-md">
              <div className="brick-studs">
                <div className={`stud ${group.color}`} />
                <div className={`stud ${group.color}`} />
              </div>
              <div className="mb-4 flex items-center gap-2">
                <div className={`h-4 w-4 rounded-sm ${group.color}`} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  {group.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`rounded-sm border border-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground/70`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-12">
          <h3 className="mb-4 text-lg font-bold text-foreground">
            Certifications
          </h3>
          <div className="brick inline-flex items-center gap-3 bg-white px-6 py-4 shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-lego-yellow">
              <svg
                className="h-5 w-5 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-foreground">
                AWS AI Practitioner
              </p>
              <p className="text-sm text-foreground/60">
                Amazon Web Services
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
