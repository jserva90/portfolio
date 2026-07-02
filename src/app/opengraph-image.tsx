import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Link-preview card (LinkedIn, X, Slack...): dark LEGO-brand composition
// generated at build time — no external assets.
export const alt = "Joosep Serva — Software Engineer building AI systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRICKS = ["#e3000b", "#f5c400", "#006db7", "#00852b"];

export default async function OpenGraphImage() {
  // Bundled in-repo so builds never depend on fetching the font.
  const bricolage = await readFile(
    join(process.cwd(), "src/app/bricolage-grotesque-800.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background: "#1a1a2e",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Stud grid backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at center, rgba(255,255,255,0.06) 3px, transparent 3px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Brick color bar */}
        <div style={{ display: "flex", gap: 10, marginBottom: 44 }}>
          {BRICKS.map((c, i) => (
            <div
              key={c}
              style={{
                width: [88, 56, 112, 44][i],
                height: 22,
                background: c,
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontSize: 84,
            fontFamily: "Bricolage Grotesque",
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          Joosep Serva
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 36,
            color: "#a0a5a8",
            display: "flex",
          }}
        >
          Software Engineer · building AI systems
        </div>

        {/* Footer row */}
        <div
          style={{
            position: "absolute",
            left: 96,
            right: 96,
            bottom: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#f5c400",
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex" }}>Tallinn, Estonia</div>
          <div style={{ display: "flex", gap: 8 }}>
            {BRICKS.map((c) => (
              <div
                key={c}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  background: c,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Bricolage Grotesque",
          data: bricolage,
          weight: 800,
          style: "normal",
        },
      ],
    },
  );
}
