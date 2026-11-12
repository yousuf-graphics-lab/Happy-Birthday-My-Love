"use client";

// ---------------------------------------------------------------------------
// SCREEN 06 — TEN REASONS, ONE ROSE
// The reasons are hidden inside a rose. Each touch unfolds another petal and
// lets one reason drift out onto the page. Ten touches and the rose is in full
// bloom — confetti, a last line, and the way onward.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";
import {
  Crown,
  Feather,
  Gift,
  HandHeart,
  Heart,
  Moon,
  Sparkles,
  Star,
  Sun,
  Wand,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import MagicButton from "@/components/ui/MagicButton";
import { useAudio } from "@/components/AudioProvider";
import { REASONS } from "@/lib/content";
import { goldenBurst } from "@/lib/confetti";

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  wand: Wand,
  hand: HandHeart,
  feather: Feather,
  sun: Sun,
  heart: Heart,
  gift: Gift,
  star: Star,
  moon: Moon,
  crown: Crown,
};

const GLOWS = [
  "rgba(255,77,141,0.55)",
  "rgba(168,85,247,0.55)",
  "rgba(255,217,160,0.5)",
  "rgba(255,140,180,0.5)",
  "rgba(255,179,71,0.5)",
  "rgba(255,77,141,0.55)",
  "rgba(255,217,160,0.5)",
  "rgba(255,247,251,0.5)",
  "rgba(168,85,247,0.5)",
  "rgba(255,217,160,0.55)",
];

const TOTAL = REASONS.items.length;

// 15 petals: an outer ring of eight, a middle ring of four, a heart of three.
const PETALS = [
  { angle: 0, ring: 0 },
  { angle: 45, ring: 0 },
  { angle: 90, ring: 0 },
  { angle: 135, ring: 0 },
  { angle: 180, ring: 0 },
  { angle: 225, ring: 0 },
  { angle: 270, ring: 0 },
  { angle: 315, ring: 0 },
  { angle: 22, ring: 1 },
  { angle: 112, ring: 1 },
  { angle: 202, ring: 1 },
  { angle: 292, ring: 1 },
  { angle: 60, ring: 2 },
  { angle: 180, ring: 2 },
  { angle: 300, ring: 2 },
];

export default function Screen06Reasons({ onContinue }: { onContinue: () => void }) {
  const { playSfx } = useAudio();
  const [revealed, setRevealed] = useState(0);
  const [burst, setBurst] = useState(false);

  const complete = revealed >= TOTAL;
  // petals open faster than reasons, so the rose leads the words
  const openPetals = Math.min(PETALS.length, Math.round((revealed / TOTAL) * PETALS.length) + 1);

  const unfold = () => {
    if (complete) {
      onContinue();
      return;
    }
    const next = revealed + 1;
    setRevealed(next);
    playSfx("bloom");
    if (next >= TOTAL) {
      setBurst(true);
      window.setTimeout(() => playSfx("celebration"), 260);
      window.setTimeout(() => goldenBurst(0.5, 0.42), 320);
    }
  };

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5 pb-20 pt-16 text-center">
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
        {REASONS.eyebrow}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 max-w-xl font-display text-3xl leading-snug text-soft sm:text-4xl"
      >
        {REASONS.heading}
      </motion.h2>

      {/* ------------------------------ the rose ------------------------------ */}
      <motion.button
        type="button"
        onClick={unfold}
        aria-label={complete ? "See the last line" : "Unfold another reason"}
        whileTap={{ scale: 0.97 }}
        className="relative mt-6 flex h-[230px] w-[230px] cursor-pointer items-center justify-center bg-transparent sm:h-[260px] sm:w-[260px]"
      >
        {/* light behind the bloom */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-2 rounded-full bg-rose/25 blur-[46px]"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* invitation ring */}
        {!complete && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-4 rounded-full border border-champagne/25"
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.97, 1.03, 0.97] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <motion.svg
          viewBox="0 0 200 200"
          className="relative h-full w-full"
          animate={{ scale: 0.94 + (openPetals / PETALS.length) * 0.12 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="petalOuter" cx="45%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#ff9dc0" />
              <stop offset="65%" stopColor="#ff5b93" />
              <stop offset="100%" stopColor="#d8326c" />
            </radialGradient>
            <radialGradient id="petalMid" cx="45%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#ffc7dc" />
              <stop offset="70%" stopColor="#ff7aa8" />
              <stop offset="100%" stopColor="#e94b83" />
            </radialGradient>
            <radialGradient id="petalInner" cx="45%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#fff0f5" />
              <stop offset="70%" stopColor="#ffb3d1" />
              <stop offset="100%" stopColor="#ff6fa3" />
            </radialGradient>
            <radialGradient id="roseCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe9c4" />
              <stop offset="60%" stopColor="#ffb347" />
              <stop offset="100%" stopColor="#c4732a" />
            </radialGradient>
          </defs>

          {PETALS.map((petal, i) => {
            const open = i < openPetals;
            const radius = petal.ring === 0 ? 52 : petal.ring === 1 ? 38 : 26;
            const w = petal.ring === 0 ? 27 : petal.ring === 1 ? 22 : 17;
            const h = petal.ring === 0 ? 44 : petal.ring === 1 ? 36 : 28;
            const fill =
              petal.ring === 0
                ? "url(#petalOuter)"
                : petal.ring === 1
                ? "url(#petalMid)"
                : "url(#petalInner)";
            return (
              <motion.ellipse
                key={i}
                cx={100}
                cy={100 - radius}
                rx={w}
                ry={h}
                fill={fill}
                style={{ transformOrigin: "100px 100px" }}
                transform={`rotate(${petal.angle} 100 100)`}
                initial={false}
                animate={
                  open
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.32, opacity: 0 }
                }
                transition={{ type: "spring", stiffness: 140, damping: 14 }}
              />
            );
          })}

          {/* heart of the rose */}
          <motion.circle
            cx="100"
            cy="100"
            r="19"
            fill="url(#roseCore)"
            initial={false}
            animate={{ scale: openPetals > 5 ? 1 : 0.75 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            style={{ transformOrigin: "100px 100px" }}
          />
          <circle cx="100" cy="100" r="7" fill="#a85a1c" opacity="0.85" />

          {/* stem + leaves */}
          <path d="M100 122 C100 150 100 170 98 196" stroke="#3f7d5c" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M100 160 C86 154 76 158 70 166 C82 170 92 168 100 160 Z" fill="#4f8f6b" />
          <path d="M100 176 C114 170 124 174 130 182 C118 186 108 184 100 176 Z" fill="#4f8f6b" />
        </motion.svg>

        {/* sparkles that puff out with each petal */}
        <AnimatePresence>
          {revealed > 0 && !complete && (
            <motion.span
              key={revealed}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 1.5], y: [-6, -26] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4 }}
              className="pointer-events-none absolute left-1/2 top-1/4 text-lg"
              aria-hidden="true"
            >
              ✨
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ------------------------------ the reasons ------------------------------ */}
      <div className="relative mt-4 w-full max-w-lg">
        <AnimatePresence>
          {revealed === 0 && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-center font-hand text-2xl text-champagne/90"
            >
              {REASONS.hint}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-2.5">
          <AnimatePresence>
            {REASONS.items.slice(0, revealed).map((item, i) => {
              const Icon = ICONS[item.icon] ?? Sparkles;
              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: -14, scale: 0.94, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{ type: "spring", stiffness: 190, damping: 20 }}
                  className="group relative overflow-hidden rounded-2xl border border-soft/10 bg-plum/45 px-4 py-3 text-left backdrop-blur-md"
                >
                  <div
                    className="pointer-events-none absolute -left-6 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full blur-2xl"
                    style={{ background: GLOWS[i % GLOWS.length] }}
                  />
                  <div className="relative flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose/30 to-violet/30 text-champagne"
                      style={{ filter: `drop-shadow(0 0 8px ${GLOWS[i % GLOWS.length]})` }}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <p className="text-[0.93rem] leading-snug text-soft/90">{item.text}</p>
                    <span className="ml-auto shrink-0 font-display text-xs text-champagne/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* counter */}
        {revealed > 0 && !complete && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-[11px] uppercase tracking-[0.3em] text-soft/45"
          >
            {revealed} / {TOTAL} petals opened
          </motion.p>
        )}
      </div>

      {/* ------------------------------ the finale ------------------------------ */}
      <AnimatePresence>
        {burst && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
            className="relative mt-8 w-full max-w-md"
          >
            <div className="glass-gold relative overflow-hidden rounded-[26px] px-7 py-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/80 to-transparent" />
              <p className="font-display text-xl leading-snug text-gradient-gold text-shadow-glow sm:text-2xl">
                {REASONS.finale}
              </p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-6"
              >
                <MagicButton onClick={onContinue} tone="gold">
                  {REASONS.continue}
                </MagicButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
