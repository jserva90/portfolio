"use client";

import { useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

type DNode = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  color: string;
  note: string;
};
type DEdge = { from: string; to: string; packets?: number };
type Diagram = {
  id: string;
  title: string;
  nodes: DNode[];
  edges: DEdge[];
  /** viewBox width — the RAG diagram is wider than the pipeline. */
  w?: number;
};

const RED = "#e3000b";
const YELLOW = "#f5c400";
const BLUE = "#006db7";
const GREEN = "#00852b";

const DIAGRAMS: Diagram[] = [
  {
    id: "pipeline",
    title: "Legal document pipeline",
    nodes: [
      { id: "docs", label: "Documents", sub: "DOCX · PDF", x: 20, y: 100, color: YELLOW, note: "Real contracts are messy: nested tables, annexes, scanned pages. First decision: never trust raw text order — parse structure, not strings." },
      { id: "parse", label: "Parsing", sub: "Docling · Azure DI", x: 175, y: 100, color: BLUE, note: "Two parsers, because tables and scans fail differently. Documents are routed by type and confidence instead of praying one library handles everything." },
      { id: "struct", label: "Structure", sub: "clause tree", x: 330, y: 40, color: GREEN, note: "Clauses become a tree before any LLM sees them — models reason far better over structure than over a flat wall of text." },
      { id: "map", label: "Placeholders", sub: "stable tokens", x: 330, y: 160, color: RED, note: "Variable spans are swapped for stable tokens before generation. That makes LLM output deterministic and edits diffable — the single highest-leverage decision in the pipeline." },
      { id: "model", label: "Variable model", sub: "typed fields", x: 490, y: 100, color: BLUE, note: "Dates, parties, amounts as typed fields — so downstream logic is validated, not guessed from prose." },
      { id: "agent", label: "Agents", sub: "LangGraph", x: 645, y: 100, color: YELLOW, note: "Editing and review as stateful graphs with tool calls. A graph beats a chain here because review genuinely branches: retries, escalations, human hand-offs." },
      { id: "ui", label: "Editor", sub: "interactive doc", x: 800, y: 100, color: GREEN, note: "The output isn't a blob of text — it's a live document whose fields and rules stay connected to the model that produced them." },
    ],
    edges: [
      { from: "docs", to: "parse", packets: 2 },
      { from: "parse", to: "struct", packets: 1 },
      { from: "parse", to: "map", packets: 1 },
      { from: "struct", to: "model", packets: 1 },
      { from: "map", to: "model", packets: 1 },
      { from: "model", to: "agent", packets: 2 },
      { from: "agent", to: "ui", packets: 1 },
    ],
  },
  {
    id: "rag",
    title: "Plug-and-play RAG platform",
    w: 1140,
    nodes: [
      { id: "src", label: "Sources", sub: "PDFs · web · docs", x: 20, y: 100, color: YELLOW, note: "Any team brings its own knowledge: PDFs, webpages, internal docs. The platform's promise is that this is the only part they have to think about." },
      { id: "ingest", label: "Ingestion", sub: "structure chunks", x: 160, y: 100, color: BLUE, note: "Chunking follows document structure, not a fixed character count — a heading plus its body beats an arbitrary 512-token window every time." },
      { id: "embed", label: "Embedder", sub: "chunks → vectors", x: 300, y: 40, color: RED, note: "Every chunk becomes a vector — and the exact same model embeds the user's question at ask-time. Mismatched embedding spaces are the classic silent RAG failure, so the embedder is pinned and versioned like a schema." },
      { id: "search", label: "OpenSearch", sub: "hybrid index", x: 440, y: 100, color: GREEN, note: "Hybrid retrieval: BM25 keywords and vectors together, because names, codes and abbreviations die in pure vector search. OpenSearch because banks already run and trust it — boring infra is a feature." },
      { id: "api", label: "Retrieval API", sub: "one platform", x: 580, y: 100, color: RED, note: "One API, many assistants. The insurance team's bot shipped in days on the same platform — that scalability was the whole point, and it won Project of the Year." },
      { id: "rerank", label: "Reranker", sub: "precision pass", x: 720, y: 40, color: BLUE, note: "Hybrid search buys recall; a cross-encoder rerank over the top-k buys precision. It reads query and chunk together, which cosine similarity never does — and it's far cheaper than stuffing a bigger context." },
      { id: "mon", label: "Langfuse", sub: "traces · feedback", x: 720, y: 160, color: YELLOW, note: "Every conversation traced, every thumbs-down reviewable. You can't improve a RAG system you can't see into." },
      { id: "llm", label: "LLM answer", sub: "grounded + cited", x: 860, y: 100, color: BLUE, note: "Answers cite their sources, and when retrieval comes back weak the bot says 'I don't know' instead of improvising. Trust is the product." },
      { id: "clients", label: "Clients", sub: "Slack · Zendesk", x: 1000, y: 100, color: GREEN, note: "Meet people where they already work — most users never saw a new UI, just better answers inside Slack and Zendesk." },
    ],
    edges: [
      { from: "src", to: "ingest", packets: 2 },
      { from: "ingest", to: "embed", packets: 1 },
      { from: "embed", to: "search", packets: 1 },
      { from: "search", to: "api", packets: 2 },
      { from: "api", to: "rerank", packets: 1 },
      { from: "api", to: "mon", packets: 1 },
      { from: "rerank", to: "llm", packets: 1 },
      { from: "llm", to: "clients", packets: 1 },
    ],
  },
];

const NODE_W = 120;
const NODE_H = 52;

function edgePath(a: DNode, b: DNode): string {
  const x1 = a.x + NODE_W;
  const y1 = a.y + NODE_H / 2;
  const x2 = b.x;
  const y2 = b.y + NODE_H / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

/**
 * Living architecture diagrams: LEGO-styled nodes with data packets
 * flowing along the pipes. Click a node for the engineering decision
 * behind it. Pure SVG + SMIL, no dependencies.
 */
export function SystemDiagrams() {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<string | null>("map");
  const d = DIAGRAMS[tab];
  const sel = d.nodes.find((n) => n.id === selected);

  return (
    <section id="under-the-hood" className="bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader title="Under the Hood" color="bg-lego-blue" />
          <p className="mt-4 max-w-2xl text-foreground/60">
            Two systems I built, as living diagrams. The dots are data —
            click any block for the engineering decision behind it.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex gap-2">
            {DIAGRAMS.map((dia, i) => (
              <button
                key={dia.id}
                onClick={() => {
                  setTab(i);
                  setSelected(DIAGRAMS[i].nodes[3].id);
                }}
                className={`rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  tab === i
                    ? "bg-lego-black text-white"
                    : "bg-lego-light text-foreground/60 hover:text-foreground"
                }`}
              >
                {dia.title}
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto rounded-sm border border-foreground/10 bg-white p-4 shadow-md">
            <svg
              key={d.id}
              viewBox={`0 0 ${d.w ?? 940} 240`}
              className="min-w-[820px]"
              role="img"
              aria-label={d.title}
            >
              {/* edges */}
              {d.edges.map((e, i) => {
                const a = d.nodes.find((n) => n.id === e.from)!;
                const b = d.nodes.find((n) => n.id === e.to)!;
                const path = edgePath(a, b);
                return (
                  <g key={i}>
                    <path
                      d={path}
                      fill="none"
                      stroke="#1a1a2e"
                      strokeOpacity={0.15}
                      strokeWidth={3}
                    />
                    {Array.from({ length: e.packets ?? 1 }).map((_, p) => (
                      <circle key={p} r={5} fill={a.color}>
                        <animateMotion
                          dur={`${2.6 + i * 0.3}s`}
                          begin={`${p * 1.3 + i * 0.4}s`}
                          repeatCount="indefinite"
                          path={path}
                        />
                      </circle>
                    ))}
                  </g>
                );
              })}
              {/* nodes */}
              {d.nodes.map((n) => (
                <g
                  key={n.id}
                  onClick={() => setSelected(n.id)}
                  style={{ cursor: "pointer" }}
                  opacity={selected && selected !== n.id ? 0.75 : 1}
                >
                  {/* studs */}
                  <rect x={n.x + 14} y={n.y - 6} width={18} height={6} rx={3} fill={n.color} opacity={0.8} />
                  <rect x={n.x + 40} y={n.y - 6} width={18} height={6} rx={3} fill={n.color} opacity={0.8} />
                  <rect
                    x={n.x}
                    y={n.y}
                    width={NODE_W}
                    height={NODE_H}
                    rx={6}
                    fill={selected === n.id ? n.color : "#1a1a2e"}
                    stroke={n.color}
                    strokeWidth={selected === n.id ? 0 : 2}
                  />
                  <text
                    x={n.x + NODE_W / 2}
                    y={n.y + 22}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={700}
                    fill="#ffffff"
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x + NODE_W / 2}
                    y={n.y + 39}
                    textAnchor="middle"
                    fontSize={9.5}
                    fontFamily="monospace"
                    fill={selected === n.id ? "rgba(255,255,255,0.85)" : "#a0a5a8"}
                  >
                    {n.sub}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* decision panel */}
          {sel && (
            <div
              key={sel.id}
              className="mt-4 rounded-sm border-l-4 bg-white p-5 shadow-md"
              style={{ borderColor: sel.color }}
            >
              <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">
                The decision
              </p>
              <h3 className="mt-1 text-lg font-bold text-foreground">
                {sel.label}{" "}
                <span className="font-mono text-sm font-normal text-foreground/50">
                  {sel.sub}
                </span>
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/70">
                {sel.note}
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
