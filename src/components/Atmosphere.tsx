"use client";

// ---------------------------------------------------------------------------
// Atmosphere — the living midnight background:
//  - canvas starfield (twinkling golden stars + slow drift)
//  - layered aurora glows (CSS)
//  - drifting glowing orbs
//  - floating hearts & rose petals
// Respects prefers-reduced-motion (calmer, static-ish scene).
// ---------------------------------------------------------------------------

import { useEffect, useRef } from "react";

export default function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;

    type Star = {
      x: number;
      y: number;
      r: number;
      baseAlpha: number;
      twinkleSpeed: number;
      twinklePhase: number;
      drift: number;
      hue: "gold" | "white" | "rose";
    };

    let stars: Star[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(190, Math.floor((width * height) / 8500));
      stars = Array.from({ length: count }, () => {
        const hueRoll = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.5 + Math.random() * 1.6,
          baseAlpha: 0.25 + Math.random() * 0.7,
          twinkleSpeed: 0.4 + Math.random() * 1.6,
          twinklePhase: Math.random() * Math.PI * 2,
          drift: 0.02 + Math.random() * 0.08,
          hue: hueRoll < 0.6 ? "gold" : hueRoll < 0.85 ? "white" : "rose",
        } as Star;
      });
    };

    const starColor = (hue: Star["hue"]) =>
      hue === "gold" ? "255, 217, 160" : hue === "rose" ? "255, 140, 180" : "255, 247, 251";

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const time = now / 1000;
      for (const star of stars) {
        const twinkle =
          0.55 + 0.45 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const alpha = star.baseAlpha * twinkle;
        const x = (star.x + (reduced ? 0 : time * star.drift * 6)) % width;
        const xi = x < 0 ? x + width : x;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgba(${starColor(star.hue)}, 1)`;
        ctx.beginPath();
        ctx.arc(xi, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
        if (star.r > 1.1) {
          ctx.globalAlpha = alpha * 0.18;
          ctx.beginPath();
          ctx.arc(xi, star.y, star.r * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduced) {
      render(performance.now()); // single static frame
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {/* aurora glows */}
      <div className="absolute -top-[20%] left-1/2 h-[70vh] w-[140vw] -translate-x-1/2 rounded-full bg-violet/20 blur-[120px] animate-aurora" />
      <div
        className="absolute top-1/3 left-[8%] h-[45vh] w-[45vh] rounded-full bg-rose/15 blur-[100px] animate-aurora"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-0 right-[6%] h-[40vh] w-[40vh] rounded-full bg-violet/15 blur-[100px] animate-aurora"
        style={{ animationDelay: "-12s" }}
      />

      {/* starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* drifting glowing orbs */}
      <div className="absolute left-[12%] top-[22%] h-24 w-24 rounded-full bg-rose/25 blur-2xl animate-float-slow" />
      <div className="absolute right-[14%] top-[30%] h-20 w-20 rounded-full bg-violet/25 blur-2xl animate-float" style={{ animationDelay: "-2s" }} />
      <div className="absolute left-[24%] bottom-[18%] h-16 w-16 rounded-full bg-champagne/15 blur-2xl animate-float" style={{ animationDelay: "-4s" }} />
      <div className="absolute right-[22%] bottom-[24%] h-20 w-20 rounded-full bg-rose/20 blur-2xl animate-float-slow" style={{ animationDelay: "-7s" }} />

      {/* floating hearts */}
      <Heart token="❤️" className="left-[8%] top-[60%]" delay={0} duration={13} />
      <Heart token="💗" className="left-[20%] top-[75%]" delay={3} duration={16} />
      <Heart token="✨" className="right-[10%] top-[55%]" delay={5} duration={14} />
      <Heart token="💖" className="right-[18%] top-[72%]" delay={1} duration={17} />
      <Heart token="💕" className="left-[46%] top-[82%]" delay={8} duration={15} />

      {/* rose petals */}
      <Petal className="left-[14%]" delay={0} duration={11} />
      <Petal className="left-[38%]" delay={4} duration={13} />
      <Petal className="left-[62%]" delay={7} duration={10} />
      <Petal className="left-[84%]" delay={2} duration={14} />
      <Petal className="left-[50%]" delay={9} duration={12} />
    </div>
  );
}

function Heart({
  token,
  className,
  delay,
  duration,
}: {
  token: string;
  className: string;
  delay: number;
  duration: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute text-2xl opacity-70 animate-heart-rise ${className}`}
      style={{ animationDelay: `-${delay}s`, animationDuration: `${duration}s` }}
    >
      {token}
    </span>
  );
}

function Petal({ className, delay, duration }: { className: string; delay: number; duration: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`absolute h-5 w-5 opacity-70 animate-petal-fall ${className}`}
      style={{ animationDelay: `-${delay}s`, animationDuration: `${duration}s` }}
    >
      <path
        d="M12 2C7 2 4 6 4 11c0 6 8 11 8 11s8-5 8-11c0-5-3-9-8-9z"
        fill="#ff8ac1"
      />
    </svg>
  );
}
