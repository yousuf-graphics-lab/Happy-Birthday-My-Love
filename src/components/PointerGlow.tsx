"use client";

// ---------------------------------------------------------------------------
// PointerGlow — a whisper of light under the cursor.
// A few faint orbs drift up from the pointer, kept deliberately subtle so the
// content always stays the star. Disabled for touch devices and reduced motion.
// ---------------------------------------------------------------------------

import { useEffect, useRef } from "react";

type Orb = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: "rose" | "violet" | "gold";
};

const HUES: Orb["hue"][] = ["rose", "gold", "rose", "violet"];

const GLOW_COLORS: Record<Orb["hue"], string> = {
  rose: "255, 77, 141",
  violet: "168, 85, 247",
  gold: "255, 217, 160",
};

export default function PointerGlow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const orbs: Orb[] = [];
    let raf = 0;
    let lastSpawn = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 14;
      orbs.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: Math.cos(angle) * speed * 0.2,
        vy: -(Math.sin(angle) * speed * 0.2) - 5,
        life: 0,
        maxLife: 500 + Math.random() * 450,
        size: 1.6 + Math.random() * 2.2,
        hue: HUES[Math.floor(Math.random() * HUES.length)],
      });
      if (orbs.length > 48) orbs.splice(0, orbs.length - 48);
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (let i = orbs.length - 1; i >= 0; i--) {
        const orb = orbs[i];
        orb.life += 16;
        orb.x += orb.vx * 0.016;
        orb.y += orb.vy * 0.016;
        orb.vy -= 3 * 0.016;
        orb.vx *= 0.98;
        if (orb.life >= orb.maxLife) {
          orbs.splice(i, 1);
          continue;
        }
        const t = orb.life / orb.maxLife;
        const alpha = (1 - t) * 0.16;
        const radius = orb.size * (1 + t * 1.4);
        const color = GLOW_COLORS[orb.hue];
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, radius * 3.2
        );
        gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, radius * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawn < 110) return;
      lastSpawn = now;
      spawn(e.clientX, e.clientY);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30"
    />
  );
}
