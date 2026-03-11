"use client";

import { useEffect } from "react";

export function TabTitle() {
  useEffect(() => {
    const original = document.title;

    function handleVisibility() {
      document.title = document.hidden ? "Hey, come back." : original;
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return null;
}
