import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

const testimonials = [
  {
    name: "Vladislav Šikirjavõi",
    role: "CTO @ Avokaado",
    color: "bg-lego-blue",
    linkedin: "https://www.linkedin.com/in/vladislav-sikirjavoi/",
    quote:
      "I worked with Joosep and really appreciated how reliable and easy he is to work with. He takes ownership, learns quickly, and doesn't need much hand-holding to get things done. He's someone you can trust with complex tasks and know they'll be handled thoughtfully from start to finish. He's especially strong when things are ambiguous or challenging. I'd gladly work with him again.",
  },
  {
    name: "Egon Saks",
    role: "Product Engineer @ Inbank",
    color: "bg-lego-yellow",
    linkedin: "https://www.linkedin.com/in/egonsaks/",
    quote:
      "Joosep is brilliant and gifted software engineer! He has strong understanding of the core fundamentals and can move between tech stacks with ease. His ability to understand different concepts and break them down to smaller actionable tasks and execute on it is truly inspiring. He was one of the top students over 2 batches, 500+ students and graduated the 2 years program with less than 8 months which is remarkable. He is for sure an asset to any company!",
  },
  {
    name: "Taivo Pikkmets",
    role: "Site Reliability Engineer @ Entigo",
    color: "bg-lego-green",
    linkedin: "https://www.linkedin.com/in/taivo-pikkmets/",
    quote:
      "Joosep consistently demonstrated dedication and drive making him a valuable teammate. His ability to grasp new concepts swiftly, sometimes in hours compared to my days or weeks, was impressive. I can confidently say that my progress during our studies owes much to Joosep. His commitment, willingness to work hard, and natural problem-solving skills make him an outstanding teammate.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader title="What People Say" color="bg-lego-green" />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={(i % 2) * 0.1} className="h-full">
              <TiltCard className="brick h-full rounded-sm bg-white p-6 shadow-md">
              <div className="brick-studs">
                <div className={`stud ${t.color}`} />
                <div className={`stud ${t.color}`} />
              </div>

              {/* Quote mark */}
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-sm ${t.color}`}
              >
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-foreground/70">
                {t.quote}
              </p>

              <a
                href={t.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${t.color} text-sm font-bold text-white`}
                >
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-foreground/50">{t.role}</p>
                </div>
              </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
