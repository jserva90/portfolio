"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { SEEKING_JOB } from "@/lib/flags";

export function Contact() {
  return (
    <section id="contact" className="bg-lego-black px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-center gap-4">
            <div className="h-8 w-3 rounded-sm bg-lego-yellow" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Let&apos;s Connect
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Reveal>
            <p className="mb-6 text-lg leading-relaxed text-lego-gray">
              I&apos;m open to new opportunities — software engineering, AI
              engineering, or anything where I get to build things with good
              people. Based in Tallinn, happy to work remote.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-lego-gray">
              I&apos;m easy to talk to. Drop me a message and let&apos;s see if
              there&apos;s a fit.
            </p>
            {SEEKING_JOB && (
              <p className="mb-8 inline-flex items-center gap-2.5 rounded-sm bg-white/10 px-4 py-3 text-sm font-semibold text-lego-green">
                <span className="pulse-dot inline-block h-2.5 w-2.5 rounded-full bg-lego-green" />
                Available for new opportunities
              </p>
            )}

            <div className="space-y-4">
              <ContactLink
                color="bg-lego-blue"
                label="LinkedIn"
                href="https://www.linkedin.com/in/joosep-serva-65b069221/"
                display="linkedin.com/in/joosep-serva"
              />
              <CopyEmail />
              <ContactLink
                color="bg-lego-green"
                label="GitHub"
                href="https://github.com/jserva90"
                display="github.com/jserva90"
              />
            </div>
          </Reveal>

          {/* Decorative brick stack */}
          <div className="hidden items-end justify-center md:flex">
            <div className="space-y-1">
              {[
                { w: "w-48", color: "bg-lego-red" },
                { w: "w-56", color: "bg-lego-blue" },
                { w: "w-64", color: "bg-lego-yellow" },
                { w: "w-72", color: "bg-lego-green" },
                { w: "w-80", color: "bg-lego-red" },
              ].map((brick, i) => (
                <Reveal key={i} delay={0.4 - i * 0.1}>
                  <div
                    className={`${brick.w} ${brick.color} flex h-10 items-center gap-3 rounded-sm px-4 opacity-20 transition-opacity hover:opacity-60`}
                  >
                    <div className="h-4 w-4 rounded-full bg-white/30" />
                    <div className="h-4 w-4 rounded-full bg-white/30" />
                    <div className="h-4 w-4 rounded-full bg-white/30" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const EMAIL = "joosepserva@gmail.com";

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  function copy(e: React.MouseEvent) {
    // Plain click copies; modified click (cmd/ctrl) falls through to mailto.
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    navigator.clipboard?.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <a
      href={`mailto:${EMAIL}`}
      onClick={copy}
      className="flex items-center gap-4 transition-transform hover:translate-x-1"
      title="Click to copy"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-lego-red">
        <span className="text-xs font-bold text-white">EM</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">Email</p>
        <p className="text-sm text-lego-gray">
          {copied ? (
            <span className="font-semibold text-lego-green">
              Copied to clipboard ✓
            </span>
          ) : (
            EMAIL
          )}
        </p>
      </div>
    </a>
  );
}

function ContactLink({
  color,
  label,
  href,
  display,
}: {
  color: string;
  label: string;
  href: string;
  display: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 transition-transform hover:translate-x-1"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-sm ${color}`}
      >
        <span className="text-xs font-bold text-white">
          {label.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-sm text-lego-gray">{display}</p>
      </div>
    </a>
  );
}
