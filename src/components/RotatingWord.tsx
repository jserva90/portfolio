"use client";

import { useEffect, useState } from "react";

/** Cycles through words with a flip-up transition. */
export function RotatingWord({
  words,
  interval = 2600,
}: {
  words: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <span key={index} className="word-flip inline-block">
        {words[index]}
      </span>
    </span>
  );
}
