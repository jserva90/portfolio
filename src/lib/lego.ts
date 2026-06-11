// Shared canvas helpers for the LEGO brick effects (hero field + build mode).

export const LEGO_COLORS = ["#e3000b", "#006db7", "#f5c400", "#00852b"];

export type Brick = {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  studs: number;
  color: string;
  resting: boolean;
  /** Wobble phase used for a tiny settle animation after landing. */
  settledAt: number;
};

const STUD_W = 22;
const BRICK_H = 22;

export function makeBrick(x: number, y: number): Brick {
  const studs = 2 + Math.floor(Math.random() * 3); // 2–4 stud bricks
  const w = studs * STUD_W;
  return {
    x: Math.round(x - w / 2),
    y,
    w,
    h: BRICK_H,
    vy: 0,
    studs,
    color: LEGO_COLORS[Math.floor(Math.random() * LEGO_COLORS.length)],
    resting: false,
    settledAt: 0,
  };
}

export function drawBrick(
  ctx: CanvasRenderingContext2D,
  b: Brick,
  now: number,
) {
  // Brief squash-and-recover when a brick lands, like it snapped into place.
  let squash = 1;
  if (b.resting && b.settledAt) {
    const t = (now - b.settledAt) / 220;
    if (t < 1) squash = 1 - 0.18 * Math.sin(t * Math.PI);
  }

  const h = b.h * squash;
  const y = b.y + (b.h - h);
  const studW = b.w / b.studs;
  const studH = 6 * squash;

  ctx.fillStyle = b.color;
  for (let i = 0; i < b.studs; i++) {
    const sx = b.x + i * studW + studW * 0.28;
    ctx.beginPath();
    ctx.roundRect(sx, y - studH, studW * 0.44, studH + 2, [3, 3, 0, 0]);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.roundRect(b.x, y, b.w, h, 2.5);
  ctx.fill();

  // Light from above, shadow below — sells the plastic look.
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.roundRect(b.x, y, b.w, h * 0.24, 2.5);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.roundRect(b.x, y + h * 0.76, b.w, h * 0.24, 2.5);
  ctx.fill();
}

/**
 * Tracks pile height in fixed-width columns so falling bricks stack on top
 * of whatever already landed beneath them.
 */
export class PileGrid {
  private heights: number[] = [];
  private colW = STUD_W;

  resize(width: number) {
    const cols = Math.max(1, Math.ceil(width / this.colW));
    if (cols !== this.heights.length) {
      this.heights = new Array(cols).fill(0);
    }
  }

  reset() {
    this.heights.fill(0);
  }

  maxHeight() {
    return Math.max(0, ...this.heights);
  }

  /** Y coordinate this brick's top should rest at, given the floor. */
  restY(b: Brick, floor: number) {
    const from = Math.max(0, Math.floor(b.x / this.colW));
    const to = Math.min(
      this.heights.length - 1,
      Math.floor((b.x + b.w - 1) / this.colW),
    );
    let pile = 0;
    for (let c = from; c <= to; c++) pile = Math.max(pile, this.heights[c]);
    return floor - pile - b.h;
  }

  settle(b: Brick, floor: number) {
    const from = Math.max(0, Math.floor(b.x / this.colW));
    const to = Math.min(
      this.heights.length - 1,
      Math.floor((b.x + b.w - 1) / this.colW),
    );
    const newPile = floor - b.y;
    for (let c = from; c <= to; c++) {
      this.heights[c] = Math.max(this.heights[c], newPile);
    }
  }
}

const GRAVITY = 2600;

/** Advance falling bricks; returns true while anything is still moving. */
export function stepBricks(
  bricks: Brick[],
  pile: PileGrid,
  floor: number,
  dt: number,
  now: number,
) {
  let moving = false;
  for (const b of bricks) {
    if (b.resting) continue;
    moving = true;
    b.vy += GRAVITY * dt;
    b.y += b.vy * dt;
    const rest = pile.restY(b, floor);
    if (b.y >= rest) {
      b.y = rest;
      b.vy = 0;
      b.resting = true;
      b.settledAt = now;
      pile.settle(b, floor);
    }
  }
  return moving;
}
