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
