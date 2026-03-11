import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-lego-black px-6 text-center">
      <div className="mb-8 flex gap-2">
        <div className="h-4 w-10 rounded-sm bg-lego-red" />
        <div className="h-4 w-10 rounded-sm bg-lego-yellow opacity-60" />
        <div className="h-4 w-10 rounded-sm bg-lego-blue opacity-30" />
      </div>

      <h1 className="text-8xl font-extrabold tracking-tight text-lego-yellow">
        404
      </h1>

      <p className="mt-6 max-w-md text-lg leading-relaxed text-lego-gray">
        You&apos;re lost. That&apos;s okay. I went from psychology to French
        horn to the military to software engineering. Detours are kind of my
        thing.
      </p>

      <Link
        href="/"
        className="mt-10 inline-flex items-center rounded-sm bg-lego-red px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
      >
        Back to safety
      </Link>
    </div>
  );
}
