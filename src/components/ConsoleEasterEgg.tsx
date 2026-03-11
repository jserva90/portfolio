"use client";

import { useEffect } from "react";

export function ConsoleEasterEgg() {
  useEffect(() => {
    console.log(
      "%c👋 Oh, you check the console. We should talk.",
      "font-size: 16px; font-weight: bold; color: #f5c400;"
    );
    console.log(
      "%cjoosepserva@gmail.com",
      "font-size: 14px; color: #006db7; text-decoration: underline;"
    );
  }, []);

  return null;
}
