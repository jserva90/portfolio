import type { Metadata } from "next";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = {
  title: "Joosep Serva — CV",
};

export default function CV() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .cv-page { padding: 0 !important; max-width: 100% !important; font-size: 13px; }
        }
      `}</style>

      {/* Print / Back buttons */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-lego-black px-6 py-3">
        <a
          href="/"
          className="text-sm font-medium text-lego-gray hover:text-white"
        >
          &larr; Back to portfolio
        </a>
        <PrintButton />
      </div>

      <div className="cv-page mx-auto max-w-[800px] px-8 py-16 font-sans text-[#1a1a2e]">
        {/* Header */}
        <header className="mb-4 border-b-2 border-[#e3000b] pb-4">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Joosep Serva
            </h1>
            <span className="rounded-sm bg-[#f5c400] px-3 py-1 text-xs font-bold text-[#1a1a2e]">
              Available from April 2026
            </span>
          </div>
          <p className="mt-1 text-base text-gray-600">
            Software Engineer &middot; AI Practitioner
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
            <span>Tallinn, Estonia</span>
            <span>&middot;</span>
            <span>joosepserva@gmail.com</span>
            <span>&middot;</span>
            <a
              href="https://www.linkedin.com/in/joosep-serva-65b069221/"
              className="text-[#006db7] underline"
            >
              LinkedIn
            </a>
            <span>&middot;</span>
            <a
              href="https://github.com/jserva90"
              className="text-[#006db7] underline"
            >
              GitHub
            </a>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Estonian (Native) &middot; English (Professional) &middot; Swedish
            (Professional)
          </div>
        </header>

        {/* Summary */}
        <section className="mb-4">
          <p className="text-sm leading-relaxed text-gray-700">
            Software engineer with 3 years of experience building production
            systems in fintech and legal tech. Engineering fundamentals in Java,
            Python, Kubernetes, and AWS — combined with hands-on AI experience
            designing RAG systems, LLM pipelines, and agentic tooling. I care
            about building things that work at scale with people who know what
            they&apos;re building and why.
          </p>
        </section>

        {/* Experience */}
        <section className="mb-4">
          <SectionTitle>Experience</SectionTitle>

          <Entry
            title="Applied AI Engineer"
            org="Avokaado"
            period="Sep 2025 — Mar 2026"
            location="Tallinn, Remote"
          >
            <li>
              Owned the entire backend and AI pipeline (Flask + SQLAlchemy) —
              from document ingestion to agent orchestration, turning legal
              documents into interactive AI agents
            </li>
            <li>
              Designed a multi-stage processing pipeline — extracting document
              structure, building data models, and generating business logic
              and decision rules from PDFs and DOCX
            </li>
            <li>
              Built stateful AI agents with LangGraph for contract editing and
              review — orchestration with conversation tracking and tool calling
            </li>
            <li>
              Engineered PDF processing with Docling and Azure Document
              Intelligence — table detection, annex splitting, deterministic
              placeholder mapping for reliable LLM handling
            </li>
          </Entry>

          <Entry
            title="Software Developer"
            org="LHV Bank"
            period="Sep 2024 — Sep 2025"
            location="Tallinn, Hybrid"
          >
            <li>
              Started with a regulatory RAG chatbot, then evolved it into a
              generic plug-and-play platform where any team could create their
              own AI assistant from PDFs, webpages, and other resources — with
              integrations for Slack, Zendesk, and a standalone API
            </li>
            <li>
              The scalable architecture made it trivial to spin up new bots —
              the insurance team&apos;s &ldquo;Kindlustusguru&rdquo; was set up with
              minimal effort and won Project of the Year at LHV Summer Days
            </li>
            <li>
              Created a Slack-integrated incident routing app that uses AI to
              analyze problem reports and notify the right person instantly
            </li>
            <li>
              Set up bank-wide AWS SageMaker Studio environment, handling
              infrastructure and DevOps for ML teams across the organization
            </li>
            <li>
              Earned AWS AI Practitioner certification (Early Adopter, Jan 2025)
            </li>
          </Entry>

          <Entry
            title="Software Developer"
            org="Solutional"
            period="May 2024 — Aug 2024"
            location="Tallinn, On-site"
          >
            <li>
              Java development in a consultancy setting with extreme
              programming and pair programming practices
            </li>
          </Entry>

          <Entry
            title="Software Developer"
            org="LHV Bank"
            period="Jul 2023 — May 2024"
            location="Tallinn, Hybrid"
          >
            <li>
              Replaced a business-critical Excel workbook used by treasury with
              a full-stack web application for tracking LHV accounts held at
              external banks — used daily across multiple departments
            </li>
            <li>
              Full stack: Java Spring backend, Angular frontend, deployed via
              Kubernetes with CI/CD — banking-grade reliability requirements
            </li>
          </Entry>
        </section>

        {/* Education */}
        <section className="mb-4">
          <SectionTitle>Education</SectionTitle>

          <Entry
            title="Computer Programming"
            org="kood/Jõhvi (42 school model)"
            period="2022 — 2023"
          >
            <li>
              Top 5% of 500+ students across 2 batches — completed the 2-year
              curriculum in under 8 months
            </li>
            <li>
              Privahunt (Cybersecurity Hackathon): built an AI-powered personal
              data risk assessment tool in 48h, reached finals, won Tera VC
              mentoring, 100+ users in first 24 hours
            </li>
          </Entry>

          <Entry
            title="Bachelor of Arts — Horn"
            org="Estonian Academy of Music and Theatre"
            period="2019 — 2022"
          >
            <li>
              Co Principal Horn, Estonian Defense Force Orchestra (2019–2020)
            </li>
          </Entry>

          <Entry
            title="Bachelor of Social Sciences — Clinical Psychology"
            org="Tallinna Ülikool"
            period="2010 — 2014"
          />
        </section>

        {/* Skills & Certifications */}
        <section className="mb-4">
          <SectionTitle>Skills &amp; Certifications</SectionTitle>
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <strong>AI &amp; ML:</strong> LangChain, LangGraph, RAG, LLM
              Pipelines, Agentic AI, Prompt Engineering, SageMaker, OCR,
              Docling, Azure Document Intelligence
            </p>
            <p>
              <strong>Backend:</strong> Python, Flask, Java, Go, Spring Boot,
              Node.js, FastAPI, SQLAlchemy, REST APIs
            </p>
            <p>
              <strong>Cloud &amp; DevOps:</strong> AWS, Kubernetes, Docker,
              Terraform, CI/CD, SageMaker Studio
            </p>
            <p>
              <strong>Frontend:</strong> Angular, React, Next.js, TypeScript,
              JavaScript
            </p>
            <p>
              <strong>Certification:</strong> AWS Certified AI Practitioner
              (Early Adopter) — Amazon Web Services, Jan 2025
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 border-b border-gray-200 pb-1 text-xs font-bold uppercase tracking-widest text-[#e3000b]">
      {children}
    </h2>
  );
}

function Entry({
  title,
  org,
  period,
  location,
  children,
}: {
  title: string;
  org: string;
  period: string;
  location?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-400">{period}</span>
      </div>
      {org && (
        <p className="text-sm text-gray-500">
          {org}
          {location && <span> &middot; {location}</span>}
        </p>
      )}
      {children && (
        <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-sm leading-relaxed text-gray-700">
          {children}
        </ul>
      )}
    </div>
  );
}
