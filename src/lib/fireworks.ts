// ---------------------------------------------------------------------------
// Firecrackers — a small, self-contained canvas show.
// Rockets climb from the bottom of the screen trailing sparks, burst into a
// ring of glittering embers, and everything fades into the night. No images,
// no libraries: just a few hundred particles and additive light.
// ---------------------------------------------------------------------------

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
  gravity: number;
  drag: number;
  glitter: boolean;
};

type Rocket = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  trail: { x: number; y: number }[];
};

const COLORS = ["#ffd9a0", "#ffe9c4", "#ff4d8d", "#ff8ac1", "#fff7fb", "#c084fc", "#ffb347"];

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let frame = 0;
let sparks: Spark[] = [];
let rockets: Rocket[] = [];
let width = 0;
let height = 0;
let quietAt = 0;
const timers: number[] = [];

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function resize() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function ensureCanvas() {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (canvas && ctx) return true;

  const el = document.createElement("canvas");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60";
  document.body.appendChild(el);

  const context = el.getContext("2d");
  if (!context) {
    el.remove();
    return false;
  }

  canvas = el;
  ctx = context;
  resize();
  window.addEventListener("resize", resize);
  return true;
}

function explode(x: number, y: number) {
  const primary = COLORS[Math.floor(Math.random() * COLORS.length)];
  const secondary = COLORS[Math.floor(Math.random() * COLORS.length)];
  const count = 54 + Math.floor(Math.random() * 26);
  const speed = 2.6 + Math.random() * 2.4;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.22;
    const velocity = speed * (0.55 + Math.random() * 0.7);
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: 52 + Math.random() * 46,
      max: 96,
      color: i % 3 === 0 ? secondary : primary,
      size: 1.1 + Math.random() * 1.5,
      gravity: 0.052,
      drag: 0.972,
      glitter: false,
    });
  }

  // a few slow, flickering glitters that hang in the air
  for (let i = 0; i < 16; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 0.4 + Math.random() * 1.4;
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: 70 + Math.random() * 50,
      max: 120,
      color: "#fff7fb",
      size: 0.9 + Math.random() * 0.9,
      gravity: 0.014,
      drag: 0.99,
      glitter: true,
    });
  }
}

function launch() {
  if (!width || !height) return;
  const x = width * (0.16 + Math.random() * 0.68);
  rockets.push({
    x,
    y: height + 8,
    vx: (Math.random() - 0.5) * 1.4,
    vy: -(9.5 + Math.random() * 3.2),
    targetY: height * (0.16 + Math.random() * 0.3),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    trail: [],
  });
  if (frame === 0) frame = requestAnimationFrame(tick);
}

function tick() {
  frame = 0;
  if (!ctx || !canvas) return;

  try {
    // fade the previous frame instead of clearing it, so sparks leave trails
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.17)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    for (let i = rockets.length - 1; i >= 0; i--) {
      const rocket = rockets[i];
      rocket.x += rocket.vx;
      rocket.y += rocket.vy;
      rocket.vy += 0.052;
      rocket.vx *= 0.995;
      rocket.trail.push({ x: rocket.x, y: rocket.y });
      if (rocket.trail.length > 10) rocket.trail.shift();

      for (let t = 0; t < rocket.trail.length; t++) {
        const point = rocket.trail[t];
        const ratio = (t + 1) / rocket.trail.length;
        ctx.globalAlpha = ratio * 0.45;
        ctx.fillStyle = rocket.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 0.5 + ratio * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 0.95;
      ctx.fillStyle = "#fff7fb";
      ctx.shadowBlur = 16;
      ctx.shadowColor = rocket.color;
      ctx.beginPath();
      ctx.arc(rocket.x, rocket.y, 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (rocket.vy >= -0.7 || rocket.y <= rocket.targetY) {
        explode(rocket.x, rocket.y);
        rockets.splice(i, 1);
      }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i];
      spark.vy += spark.gravity;
      spark.vx *= spark.drag;
      spark.vy *= spark.drag;
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.life -= 1;

      if (spark.life <= 0 || spark.y > height + 40) {
        sparks.splice(i, 1);
        continue;
      }

      const fade = spark.life / spark.max;
      const flicker = spark.glitter ? (Math.random() > 0.4 ? 1 : 0.12) : 1;
      ctx.globalAlpha = Math.max(0, fade * flicker);
      ctx.strokeStyle = spark.color;
      ctx.lineWidth = spark.size * (0.45 + fade * 0.9);
      ctx.beginPath();
      ctx.moveTo(spark.x, spark.y);
      ctx.lineTo(spark.x - spark.vx * 2.1, spark.y - spark.vy * 2.1);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  } catch {
    stopFirecrackers();
    return;
  }

  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  if (rockets.length === 0 && sparks.length === 0 && now > quietAt) {
    stopFirecrackers();
    return;
  }
  frame = requestAnimationFrame(tick);
}

/** Let off a handful of firecrackers across the sky. */
export function firecrackers(count = 6) {
  if (prefersReducedMotion() || !ensureCanvas()) return;

  const total = Math.max(1, Math.min(count, 12));
  for (let i = 0; i < total; i++) {
    const id = window.setTimeout(() => launch(), i * 210 + Math.random() * 130);
    timers.push(id);
  }
  quietAt =
    (typeof performance !== "undefined" ? performance.now() : Date.now()) + total * 240 + 2600;
  if (frame === 0) frame = requestAnimationFrame(tick);
}

/** Stop the show early and put the canvas away. */
export function stopFirecrackers() {
  while (timers.length) {
    const id = timers.pop();
    if (id !== undefined) window.clearTimeout(id);
  }
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  sparks = [];
  rockets = [];
  quietAt = 0;
  if (canvas) {
    window.removeEventListener("resize", resize);
    canvas.remove();
  }
  canvas = null;
  ctx = null;
}
