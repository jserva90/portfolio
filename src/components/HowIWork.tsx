export function HowIWork() {
  return (
    <section className="bg-lego-black px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-4">
          <div className="h-8 w-3 rounded-sm bg-lego-yellow" />
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            How I Work
          </h2>
        </div>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-lego-gray">
          I&apos;ve learned what kind of environment brings out my best work.
          Here&apos;s what I care about:
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <ValueCard
            color="bg-lego-red"
            title="Clear direction"
            description="I want to know what we're building and why. I'll bring ideas, challenge assumptions, and think about the product — but I need a team that has a vision, not one that expects the engineer to figure out the business."
          />
          <ValueCard
            color="bg-lego-blue"
            title="Build with, not for"
            description="My best work happened when I had a great architect next to me — someone who pushed my thinking and helped me grow. It inspired me to think architecturally myself. I thrive when smart people from different roles bring their perspectives and we figure it out together."
          />
          <ValueCard
            color="bg-lego-green"
            title="Engineering over hype"
            description="AI is an incredible tool — I use it every day. But the real value comes from knowing what to build, how to make it scale, and why it matters. Good engineering judgment doesn't get replaced, it gets amplified."
          />
        </div>
      </div>
    </section>
  );
}

function ValueCard({
  color,
  title,
  description,
}: {
  color: string;
  title: string;
  description: string;
}) {
  return (
    <div className="brick rounded-sm bg-white/5 p-6">
      <div className="brick-studs">
        <div className={`stud ${color}`} />
        <div className={`stud ${color}`} />
      </div>
      <div className={`mb-4 h-1 w-12 rounded-full ${color}`} />
      <h3 className="mb-3 text-lg font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-lego-gray">{description}</p>
    </div>
  );
}
