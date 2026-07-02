"use client";

import { useEffect } from "react";

const YELLOW = "font-size: 14px; font-weight: bold; color: #f5c400;";
const BLUE = "font-size: 13px; color: #006db7;";
const GRAY = "font-size: 12px; color: #a0a5a8;";

export function ConsoleEasterEgg() {
  useEffect(() => {
    console.log(
      "%c👋 Oh, you check the console. We should talk.",
      "font-size: 16px; font-weight: bold; color: #f5c400;",
    );
    console.log("%cTry: %cjoosep.help()", GRAY, BLUE);

    // A tiny console API for fellow devtools-openers.
    const api = {
      help() {
        console.log("%cjoosep — available commands", YELLOW);
        console.log("%c  joosep.stack()     %c→ what I build with", BLUE, GRAY);
        console.log("%c  joosep.story()     %c→ the short version", BLUE, GRAY);
        console.log("%c  joosep.brickify()  %c→ turn a photo into LEGO", BLUE, GRAY);
        console.log("%c  joosep.contact()   %c→ say hi", BLUE, GRAY);
        console.log("%c  joosep.hire()      %c→ straight to the point", BLUE, GRAY);
        return "🧱";
      },
      stack() {
        console.log(
          "%cPython · TypeScript · LangChain/LangGraph · AWS · RAG pipelines · Terraform · Java/Spring",
          BLUE,
        );
        return "engineer first, AI second";
      },
      story() {
        console.log(
          "%cPsychology → French horn in the Defense Force orchestra → software engineer.\nAll of it helps: understanding people is half the job.",
          GRAY,
        );
        return "🎺 → 🧠 → 💻";
      },
      brickify() {
        window.location.href = "/brickify";
        return "brb, building";
      },
      contact() {
        console.log("%cjoosepserva@gmail.com", YELLOW);
        console.log("%chttps://www.linkedin.com/in/joosep-serva-65b069221/", BLUE);
        return "📬";
      },
      hire() {
        window.location.href =
          "mailto:joosepserva@gmail.com?subject=Found%20you%20through%20the%20console&body=Hi%20Joosep%2C%0A%0AI%20typed%20joosep.hire()%20and%20here%20we%20are.";
        return "🤝";
      },
    };

    (window as unknown as Record<string, unknown>).joosep = api;

    console.log("%cjoosepserva@gmail.com", "font-size: 14px; color: #006db7; text-decoration: underline;");
  }, []);

  return null;
}
