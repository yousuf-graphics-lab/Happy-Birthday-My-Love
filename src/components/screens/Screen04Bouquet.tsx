"use client";

// ---------------------------------------------------------------------------
// SCREEN 04 — A BOUQUET FOR HER
// Animated flower garden (roses, lilies, gold blooms) that bloom one by one,
// glowing butterflies, floating petals, and the poem written for Samiya.
// "Accept These Flowers? 🌹" showers the screen with rose petals.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import MagicButton from "@/components/ui/MagicButton";
import { useAudio } from "@/components/AudioProvider";
import { BOUQUET } from "@/lib/content";
import { rosePetalShower } from "@/lib/confetti";

// positioned flowers: type, left%, scale, delay
const FLOWERS: { type: FlowerType; left: string; scale: number; delay: number }[] = [
  { type: "rose-red", left: "8%", scale: 1, delay: 0 },
  { type: "rose-blush", left: "22%", scale: 0.85, delay: 0.4 },
  { type: "lily", left: "36%", scale: 0.9, delay: 0.8 },
  { type: "rose-red", left: "50%", scale: 1.1, delay: 0.2 },
  { type: "gold", left: "64%", scale: 0.8, delay: 0.6 },
  { type: "rose-blush", left: "78%", scale: 0.95, delay: 1 },
  { type: "lily", left: "90%", scale: 0.75, delay: 1.3 },
];

const BUTTERFLIES = [
  { left: "15%", delay: 0 },
  { left: "45%", delay: 2 },
  { left: "75%", delay: 4 },
  { left: "30%", delay: 6 },
];

export default function Screen04Bouquet({ onContinue }: { onContinue: () => void }) {
  const { playSfx } = useAudio();
  const [accepted, setAccepted] = useState(false);

  const accept = () => {
    if (accepted) {
      onContinue();
      return;
    }
    setAccepted(true);
    playSfx("bloom");
    rosePetalShower();
    window.setTimeout(() => playSfx("sparkle"), 500);
  };

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5 py-20 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl font-display text-3xl leading-snug text-soft sm:text-4xl"
      >
        {BOUQUET.heading}
      </motion.h2>

      {/* flower garden */}
      <div className="relative mt-8 h-[46vh] w-full max-w-3xl min-h-[280px]">
        {/* ground glow */}
        <div className="absolute bottom-0 left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-full bg-rose/20 blur-2xl" />

        {FLOWERS.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, y: 30 }}
            animate={{ opacity: 1, scale: f.scale, y: 0 }}
            transition={{ delay: f.delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0"
            style={{ left: f.left }}
          >
            <Flower type={f.type} />
          </motion.div>
        ))}

        {/* butterflies */}
        {BUTTERFLIES.map((b, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: b.left, top: "12%" }}
            animate={{
              x: [0, 40, -30, 20, 0],
              y: [0, -25, 15, -10, 0],
              rotate: [0, 8, -6, 4, 0],
            }}
            transition={{ duration: 9 + i * 2, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
          >
            🦋
          </motion.div>
        ))}

        {/* floating petals overlay */}
        <PetalSparkles />
      </div>

      {/* the poem */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="mt-10 w-full max-w-lg"
      >
        <GlassCard variant="strong" className="p-7 sm:p-9">
          <div className="mx-auto mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rose/50" />
            <Heart className="h-4 w-4 fill-rose text-rose" strokeWidth={1.5} />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rose/50" />
          </div>
          <div className="space-y-3">
            {BOUQUET.poem.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + i * 0.14, duration: 0.6 }}
                className="font-display text-lg leading-relaxed text-soft/90 sm:text-xl"
              >
                {line}
              </motion.p>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 + BOUQUET.poem.length * 0.14 + 0.2 }}
            className="mt-6 text-right font-hand text-2xl text-champagne"
          >
            {BOUQUET.signature}
          </motion.p>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
        className="mt-12"
      >
        <MagicButton onClick={accept} tone={accepted ? "gold" : "rose"}>
          {accepted ? BOUQUET.accepted : BOUQUET.button}
        </MagicButton>
      </motion.div>
    </section>
  );
}

type FlowerType = "rose-red" | "rose-blush" | "lily" | "gold";

function Flower({ type }: { type: FlowerType }) {
  const colors = {
    "rose-red": { petal: "#ff4d8d", center: "#e63e7a", glow: "rgba(255,77,141,0.4)" },
    "rose-blush": { petal: "#ffb3d1", center: "#ff8ac1", glow: "rgba(255,179,209,0.4)" },
    lily: { petal: "#fff7fb", center: "#ffd9a0", glow: "rgba(255,247,251,0.35)" },
    gold: { petal: "#ffd9a0", center: "#ffb347", glow: "rgba(255,217,160,0.4)" },
  }[type];

  return (
    <div className="relative" style={{ filter: `drop-shadow(0 8px 20px ${colors.glow})` }}>
      {/* stem */}
      <div className="mx-auto h-16 w-2 rounded-full bg-gradient-to-b from-rose-300/70 to-violet-300/40" />
      {/* leaves */}
      <svg viewBox="0 0 30 40" className="absolute -left-6 bottom-12 h-10 w-12" aria-hidden="true">
        <path d="M28 8C14 4 4 12 6 24c10-6 18-6 22-16z" fill="#7dd3a0" opacity="0.55" />
      </svg>
      {/* bloom */}
      <svg viewBox="0 0 80 80" className="h-24 w-24 animate-float-slow" aria-hidden="true">
        {type === "lily" ? (
          <g>
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <ellipse
                key={deg}
                cx="40"
                cy="22"
                rx="9"
                ry="20"
                fill={colors.petal}
                opacity="0.92"
                transform={`rotate(${deg} 40 40)`}
              />
            ))}
            <circle cx="40" cy="40" r="7" fill={colors.center} />
            <circle cx="40" cy="40" r="3" fill="#fff7fb" opacity="0.8" />
          </g>
        ) : type === "gold" ? (
          <g>
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse
                key={i}
                cx="40"
                cy="20"
                rx="6"
                ry="16"
                fill={colors.petal}
                opacity="0.9"
                transform={`rotate(${i * 30} 40 40)`}
              />
            ))}
            <circle cx="40" cy="40" r="9" fill={colors.center} />
            <circle cx="40" cy="40" r="4" fill="#fff7fb" opacity="0.7" />
          </g>
        ) : (
          <g>
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <ellipse
                key={deg}
                cx="40"
                cy="24"
                rx="12"
                ry="16"
                fill={colors.petal}
                opacity="0.9"
                transform={`rotate(${deg} 40 40)`}
              />
            ))}
            {[30, 90, 150, 210, 270, 330].map((deg) => (
              <ellipse
                key={deg}
                cx="40"
                cy="26"
                rx="9"
                ry="13"
                fill={colors.petal}
                opacity="0.7"
                transform={`rotate(${deg} 40 40)`}
              />
            ))}
            <circle cx="40" cy="40" r="9" fill={colors.center} />
            <circle cx="37" cy="37" r="2.5" fill="#ffd9a0" opacity="0.85" />
          </g>
        )}
      </svg>
    </div>
  );
}

function PetalSparkles() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute text-xl"
          style={{ left: `${15 + i * 17}%`, top: "0%" }}
          animate={{ y: [0, 320], x: [0, (i % 2 ? 1 : -1) * 30], rotate: [0, 360], opacity: [0, 1, 0.7, 0] }}
          transition={{ duration: 8 + i, repeat: Infinity, ease: "easeIn", delay: i * 1.4 }}
        >
          🌸
        </motion.span>
      ))}
    </>
  );
}
