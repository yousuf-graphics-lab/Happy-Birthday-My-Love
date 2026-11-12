"use client";

// ---------------------------------------------------------------------------
// SCREEN 06 — 10 REASONS WHY YOU ARE SPECIAL
// Ten interactive glass cards revealed one at a time, each with a unique
// glowing icon, soft rose lighting and a tiny heart.
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

// each icon gets its own glow hue
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

export default function Screen06Reasons({ onContinue }: { onContinue: () => void }) {
  const { playSfx } = useAudio();
  const [revealed, setRevealed] = useState(0);
  const [burst, setBurst] = useState(false);

  const revealNext = () => {
    if (revealed >= REASONS.items.length) {
      onContinue();
      return;
    }
    const next = revealed + 1;
    setRevealed(next);
    playSfx("sparkle");
    if (next >= REASONS.items.length) {
      setBurst(true);
      window.setTimeout(() => playSfx("chime"), 400);
    }
  };

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-4xl text-soft sm:text-5xl"
      >
        {REASONS.heading}
      </motion.h2>

      <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-2 sm:gap-5">
        <AnimatePresence>
          {REASONS.items.slice(0, revealed).map((item, i) => {
            const Icon = ICONS[item.icon] ?? Sparkles;
            return (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <div className="glass relative h-full overflow-hidden rounded-3xl p-5 transition duration-300 group-hover:-translate-y-1 group-hover:border-rose/40">
                  {/* rose lighting */}
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition group-hover:h-28 group-hover:w-28"
                    style={{ background: GLOWS[i] }}
                  />
                  <div className="relative flex items-start gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose/30 to-violet/30 text-champagne shadow-[0_0_25px_-5px_rgba(255,77,141,0.6)]"
                      style={{ filter: `drop-shadow(0 0 8px ${GLOWS[i]})` }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <p className="pt-1 text-sm leading-snug text-soft/85">{item.text}</p>
                  </div>
                  <Heart
                    className="absolute right-4 top-4 h-4 w-4 fill-rose/60 text-rose/60"
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* finale */}
      <AnimatePresence mode="wait">
        {burst ? (
          <motion.div
            key="finale"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-2xl text-gradient-rose text-shadow-glow sm:text-3xl"
            >
              {REASONS.finale}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10"
            >
              <MagicButton onClick={onContinue} tone="gold">
                {REASONS.continue}
              </MagicButton>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="next"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            <MagicButton onClick={revealNext} tone="rose">
              {revealed === 0 ? "Show Me the First Reason ✨" : `And One More… (${revealed}/${REASONS.items.length})`}
            </MagicButton>
            {revealed > 0 && (
              <p className="mt-3 text-xs text-soft/45">
                or scroll up to see them again 💕
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
