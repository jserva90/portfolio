"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-sm bg-lego-red px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
    >
      Download PDF
    </button>
  );
}
