// Isometric LEGO engine: voxel modelling + auto-bricker for bulk volumes,
// an explicit part catalog (plates, tiles, slopes, cylinders, cones, domes,
// Technic bricks) for detailing, and a canvas renderer with three-face
// shading, studs on exposed tops, and Technic pin holes.

export type Voxels = Map<string, string>; // "x,y,z" -> color

export const vkey = (x: number, y: number, z: number) => `${x},${y},${z}`;

/** Solid axis-aligned box of voxels. Later calls overwrite earlier ones. */
export function box(
  v: Voxels,
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number,
  color: string,
) {
  for (let i = 0; i < w; i++)
    for (let j = 0; j < d; j++)
      for (let k = 0; k < h; k++) v.set(vkey(x + i, y + j, z + k), color);
}

/** Filled ellipse of voxels in the X/Y plane at height z. */
export function disc(
  v: Voxels,
  cx: number,
  cy: number,
  z: number,
  rx: number,
  ry: number,
  color: string,
) {
  for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      if (nx * nx + ny * ny <= 1.05) v.set(vkey(x, y, z), color);
    }
  }
}

/** Filled disc in the Y/Z plane at a fixed x — used for horn-bell rings. */
export function discYZ(
  v: Voxels,
  x: number,
  cy: number,
  cz: number,
  r: number,
  color: string,
) {
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
    for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++) {
      const ny = (y - cy) / r;
      const nz = (z - cz) / r;
      if (ny * ny + nz * nz <= 1.05) v.set(vkey(x, y, z), color);
    }
  }
}

/**
 * Ring (tube cross-section) in the X/Z plane, `depth` voxels deep in y.
 * `zScale` compresses the ring vertically in voxel space to compensate
 * for LEGO bricks being 1.2x taller than wide — pass 1.2 for a ring
 * that renders circular on screen.
 */
export function ringXZ(
  v: Voxels,
  cx: number,
  cz: number,
  y: number,
  depth: number,
  rOuter: number,
  rInner: number,
  color: string,
  zScale = 1,
) {
  for (let x = Math.floor(cx - rOuter); x <= Math.ceil(cx + rOuter); x++) {
    for (
      let z = Math.floor(cz - rOuter / zScale);
      z <= Math.ceil(cz + rOuter / zScale);
      z++
    ) {
      const d = Math.hypot(x - cx, (z - cz) * zScale);
      if (d <= rOuter + 0.4 && d >= rInner - 0.4) {
        for (let j = 0; j < depth; j++) v.set(vkey(x, y + j, z), color);
      }
    }
  }
}

// --- Part catalog ------------------------------------------------------

export type PartKind =
  | "brick" // 3005-3008 family: studded box, 1 brick tall by default
  | "plate" // 3024+ family: studded box, 1/3 brick tall
  | "tile" // 3070+ family: smooth box, no studs
  | "slope" // 3040 family: 45° wedge, slant faces +x (dir 0) or +y (dir 1)
  | "cheese" // 54200: 1x1 30° slope, 2/3 brick tall
  | "cylinder" // 3062 round brick / 4032 round plate (set h)
  | "roundTile" // 98138: smooth low cylinder
  | "cone" // 4589
  | "dome" // 553: 2x2 dome top
  | "technic" // 3700 family: brick with pin holes on the long face
  | "bar"; // 30374 bar / 3957 antenna: thin vertical rod

export type Part = {
  kind: PartKind;
  x: number;
  y: number;
  z: number; // bottom, in brick-height units (plates land on thirds)
  w: number;
  d: number;
  h: number; // height in brick-height units
  dir: 0 | 1;
  color: string;
  studs: Array<[number, number]>;
};

const DEFAULT_H: Record<PartKind, number> = {
  brick: 1,
  plate: 1 / 3,
  tile: 1 / 3,
  slope: 1,
  cheese: 2 / 3,
  cylinder: 1,
  roundTile: 1 / 3,
  cone: 1,
  dome: 0.85,
  technic: 1,
  bar: 3,
};

const STUDDED: PartKind[] = ["brick", "plate", "cylinder", "technic"];

/** Make a catalog part. Studded kinds get studs on every cell by default. */
export function part(
  kind: PartKind,
  color: string,
  x: number,
  y: number,
  z: number,
  w = 1,
  d = 1,
  h = DEFAULT_H[kind],
  dir: 0 | 1 = 0,
): Part {
  const studs: Array<[number, number]> = [];
  if (STUDDED.includes(kind)) {
    for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) studs.push([i, j]);
  }
  return { kind, x, y, z, w, d, h, dir, color, studs };
}

/**
 * Convert voxels into LEGO bricks. Rows merge along x on even layers and
 * along y on odd layers (interleaved bond), runs cap at 4 studs, and
 * parallel 1xN runs pair into 2xN bricks. Hidden voxels are culled.
 */
export function brickify(v: Voxels): Part[] {
  const visible: Voxels = new Map();
  for (const [key, color] of v) {
    const [x, y, z] = key.split(",").map(Number);
    const hidden =
      v.has(vkey(x + 1, y, z)) &&
      v.has(vkey(x - 1, y, z)) &&
      v.has(vkey(x, y + 1, z)) &&
      v.has(vkey(x, y - 1, z)) &&
      v.has(vkey(x, y, z + 1)) &&
      v.has(vkey(x, y, z - 1));
    if (!hidden) visible.set(key, color);
  }

  const used = new Set<string>();
  const bricks: Part[] = [];
  const keys = [...visible.keys()]
    .map((k) => k.split(",").map(Number) as [number, number, number])
    .sort((a, b) => a[2] - b[2] || a[1] - b[1] || a[0] - b[0]);

  for (const [x, y, z] of keys) {
    if (used.has(vkey(x, y, z))) continue;
    const color = visible.get(vkey(x, y, z))!;
    const alongX = z % 2 === 0;
    const [dx, dy] = alongX ? [1, 0] : [0, 1];

    let len = 1;
    while (
      len < 4 &&
      visible.get(vkey(x + dx * len, y + dy * len, z)) === color &&
      !used.has(vkey(x + dx * len, y + dy * len, z))
    ) {
      len++;
    }
    const [px, py] = alongX ? [0, 1] : [1, 0];
    let wide = true;
    for (let i = 0; i < len; i++) {
      const k = vkey(x + dx * i + px, y + dy * i + py, z);
      if (visible.get(k) !== color || used.has(k)) {
        wide = false;
        break;
      }
    }

    const w = alongX ? len : wide ? 2 : 1;
    const d = alongX ? (wide ? 2 : 1) : len;
    for (let i = 0; i < w; i++)
      for (let j = 0; j < d; j++) used.add(vkey(x + i, y + j, z));

    const studs: Array<[number, number]> = [];
    for (let i = 0; i < w; i++)
      for (let j = 0; j < d; j++)
        if (!v.has(vkey(x + i, y + j, z + 1))) studs.push([i, j]);

    bricks.push({
      kind: "brick",
      x,
      y,
      z,
      w,
      d,
      h: 1,
      dir: 0,
      color,
      studs,
    });
  }
  return bricks;
}

/** Painter order: bottom-up, back-to-front. Call after merging part lists. */
export function painterSort(parts: Part[]) {
  parts.sort((a, b) => a.z - b.z || a.x + a.y - (b.x + b.y));
  return parts;
}

// --- Projection & rendering -------------------------------------------

const COS = 0.866; // cos 30°
const SIN = 0.5; // sin 30°
const ZH = 1.2; // LEGO brick height / stud pitch

export function project(x: number, y: number, z: number, s: number) {
  return {
    px: (x - y) * COS * s,
    py: (x + y) * SIN * s - z * ZH * s,
  };
}

type Shades = {
  top: string;
  right: string;
  left: string;
  hi: string;
  slant: string;
};

const shadeCache = new Map<string, Shades>();

function shades(color: string): Shades {
  let out = shadeCache.get(color);
  if (out) return out;
  const n = parseInt(color.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const mix = (c: number, t: number, f: number) => Math.round(c + (t - c) * f);
  const css = (f: number, t: number) =>
    `rgb(${mix(r, t, f)},${mix(g, t, f)},${mix(b, t, f)})`;
  out = {
    top: css(0.25, 255),
    right: css(0.12, 0),
    left: css(0.38, 0),
    hi: css(0.45, 255),
    slant: css(0.1, 255),
  };
  shadeCache.set(color, out);
  return out;
}

const OUTLINE = "rgba(10,10,25,0.35)";

function poly(
  ctx: CanvasRenderingContext2D,
  pts: Array<{ px: number; py: number }>,
  fill: string,
  stroke = true,
) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(pts[0].px, pts[0].py);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].px, pts[i].py);
  ctx.closePath();
  ctx.fill();
  if (stroke) ctx.stroke();
}

function drawStuds(
  ctx: CanvasRenderingContext2D,
  p: Part,
  pt: (x: number, y: number, z: number) => { px: number; py: number },
  s: number,
  sh: Shades,
) {
  const rx = s * 0.34;
  const ry = rx * SIN * 1.15;
  const lift = s * 0.22;
  for (const [i, j] of p.studs) {
    const c = pt(i + 0.5, j + 0.5, p.h);
    ctx.fillStyle = sh.right;
    ctx.beginPath();
    ctx.ellipse(c.px, c.py, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(c.px - rx, c.py - lift, rx * 2, lift);
    ctx.fillStyle = sh.hi;
    ctx.beginPath();
    ctx.ellipse(c.px, c.py - lift, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Box body shared by brick / plate / tile / technic. */
function drawBox(
  ctx: CanvasRenderingContext2D,
  p: Part,
  pt: (x: number, y: number, z: number) => { px: number; py: number },
  sh: Shades,
) {
  const t00 = pt(0, 0, p.h);
  const tw0 = pt(p.w, 0, p.h);
  const twd = pt(p.w, p.d, p.h);
  const t0d = pt(0, p.d, p.h);
  const hpx = pt(0, 0, 0).py - t00.py;
  const drop = (q: { px: number; py: number }) => ({ px: q.px, py: q.py + hpx });
  poly(ctx, [t0d, twd, drop(twd), drop(t0d)], sh.left);
  poly(ctx, [twd, tw0, drop(tw0), drop(twd)], sh.right);
  poly(ctx, [t00, tw0, twd, t0d], sh.top);
}

/**
 * Draw one part with its voxel origin translated to screen (ox, oy).
 * Pure canvas 2D; faces are painted back-to-front within the part.
 */
export function drawPart(
  ctx: CanvasRenderingContext2D,
  p: Part,
  ox: number,
  oy: number,
  s: number,
  alpha: number,
) {
  const sh = shades(p.color);
  const pt = (x: number, y: number, z: number) => ({
    px: ox + (x - y) * COS * s,
    py: oy + (x + y) * SIN * s - z * ZH * s,
  });

  ctx.globalAlpha = alpha;
  ctx.lineJoin = "round";
  ctx.lineWidth = 1;
  ctx.strokeStyle = OUTLINE;

  switch (p.kind) {
    case "brick":
    case "plate":
    case "tile":
    case "technic": {
      drawBox(ctx, p, pt, sh);
      if (p.kind === "technic") {
        // Pin holes along the long visible face.
        const onX = p.w >= p.d;
        const n = onX ? p.w : p.d;
        for (let i = 0; i < n; i++) {
          const c = onX
            ? pt(i + 0.5, p.d, p.h / 2)
            : pt(p.w, i + 0.5, p.h / 2);
          ctx.fillStyle = "rgba(15,15,30,0.8)";
          ctx.beginPath();
          ctx.ellipse(c.px, c.py, s * 0.26, s * 0.2, onX ? 0.5 : -0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      drawStuds(ctx, p, pt, s, sh);
      break;
    }

    case "slope":
    case "cheese": {
      // Wedge: full height at the back edge, a small lip at the front.
      const lip = p.kind === "cheese" ? 0.12 : 0.3;
      if (p.dir === 0) {
        // slant descends toward +x
        const hi0 = pt(0, 0, p.h);
        const hid = pt(0, p.d, p.h);
        const lo0 = pt(p.w, 0, lip);
        const lod = pt(p.w, p.d, lip);
        const b0 = pt(0, p.d, 0);
        const bw = pt(p.w, p.d, 0);
        const bw0 = pt(p.w, 0, 0);
        poly(ctx, [hid, lod, bw, b0], sh.left); // side pentagon (y+)
        poly(ctx, [lod, lo0, bw0, bw], sh.right); // front lip face
        poly(ctx, [hi0, lo0, lod, hid], sh.slant); // slanted face
      } else {
        // slant descends toward +y
        const hi0 = pt(0, 0, p.h);
        const hiw = pt(p.w, 0, p.h);
        const lo0 = pt(0, p.d, lip);
        const low = pt(p.w, p.d, lip);
        const b0 = pt(0, p.d, 0);
        const bw = pt(p.w, p.d, 0);
        const bwx = pt(p.w, 0, 0);
        poly(ctx, [low, lo0, b0, bw], sh.left); // front lip face
        poly(ctx, [hiw, low, bw, bwx], sh.right); // side pentagon (x+)
        poly(ctx, [hi0, hiw, low, lo0], sh.slant); // slanted face
      }
      break;
    }

    case "cylinder":
    case "roundTile":
    case "cone": {
      const r = Math.min(p.w, p.d) / 2;
      const rt = p.kind === "cone" ? r * 0.45 : r;
      const c = pt(p.w / 2, p.d / 2, 0);
      const ct = pt(p.w / 2, p.d / 2, p.h);
      const A = r * Math.SQRT2 * COS * s;
      const B = r * Math.SQRT2 * SIN * s;
      const At = rt * Math.SQRT2 * COS * s;
      const Bt = rt * Math.SQRT2 * SIN * s;
      // Side: trapezoid between tangent lines + bottom bulge.
      ctx.fillStyle = sh.right;
      ctx.beginPath();
      ctx.moveTo(ct.px - At, ct.py);
      ctx.lineTo(ct.px + At, ct.py);
      ctx.lineTo(c.px + A, c.py);
      ctx.ellipse(c.px, c.py, A, B, 0, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Darker left third for roundness.
      ctx.save();
      ctx.clip();
      ctx.fillStyle = sh.left;
      ctx.fillRect(c.px - A, ct.py - B, A * 0.66, c.py - ct.py + 2 * B + 2);
      ctx.restore();
      // Cap.
      ctx.fillStyle = sh.top;
      ctx.beginPath();
      ctx.ellipse(ct.px, ct.py, At, Bt, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (p.kind === "cylinder") drawStuds(ctx, p, pt, s, sh);
      break;
    }

    case "bar": {
      const c = pt(p.w / 2, p.d / 2, 0);
      const t = pt(p.w / 2, p.d / 2, p.h);
      const bw = Math.max(s * 0.14, 1.5);
      ctx.fillStyle = sh.right;
      ctx.fillRect(t.px - bw / 2, t.py, bw, c.py - t.py);
      ctx.fillStyle = sh.hi;
      ctx.beginPath();
      ctx.ellipse(t.px, t.py, bw * 0.7, bw * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case "dome": {
      const r = Math.min(p.w, p.d) / 2;
      const c = pt(p.w / 2, p.d / 2, 0);
      const A = r * Math.SQRT2 * COS * s;
      const B = r * Math.SQRT2 * SIN * s;
      const rise = p.h * ZH * s;
      // Base ellipse + dome cap as a clipped ball.
      ctx.fillStyle = sh.right;
      ctx.beginPath();
      ctx.ellipse(c.px, c.py, A, B, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = sh.slant;
      ctx.beginPath();
      ctx.moveTo(c.px - A, c.py);
      ctx.bezierCurveTo(
        c.px - A,
        c.py - rise * 1.33,
        c.px + A,
        c.py - rise * 1.33,
        c.px + A,
        c.py,
      );
      ctx.ellipse(c.px, c.py, A, B, 0, 0, Math.PI, false);
      ctx.fill();
      ctx.stroke();
      // Highlight.
      ctx.fillStyle = sh.hi;
      ctx.beginPath();
      ctx.ellipse(
        c.px - A * 0.3,
        c.py - rise * 0.55,
        A * 0.22,
        B * 0.3,
        -0.5,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      break;
    }
  }
  ctx.globalAlpha = 1;
}
