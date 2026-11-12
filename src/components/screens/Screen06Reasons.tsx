"use client";

// ---------------------------------------------------------------------------
// SCREEN 06 — TEN NOTES, A GARDEN OF FLOWERS
// The notes hide as buds. Each touch blooms one flower in the garden and sets
// its note free beneath it, poem and all. Ten flowers later: confetti, a last
// line, and the way onward.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Bloom, { type BloomKind } from "@/components/flowers/Bloom";
import MagicButton from "@/components/ui/MagicButton";
import { useAudio } from "@/components/AudioProvider";
import { REASONS } from "@/lib/content";
import { goldenBurst } from "@/lib/confetti";

const TOTAL = REASONS.items.length;

const TINTS = [
  "rgba(255,77,141,0.45)",
  "rgba(255,253,247,0.4)",
  "rgba(255,111,145,0.45)",
  "rgba(255,233,196,0.4)",
  "rgba(255,217,160,0.45)",
  "rgba(255,140,193,0.45)",
  "rgba(255,247,251,0.4)",
  "rgba(233,75,131,0.45)",
  "rgba(168,85,247,0.4)",
  "rgba(255,179,209,0.45)",
];

export default function Screen06Reasons({ onContinue }: { onContinue: () => void }) {
  const { playSfx } = useAudio();
  const [revealed, setRevealed] = useState(0);
  const [burst, setBurst] = useState(false);

  const complete = revealed >= TOTAL;

  const bloomNext = () => {
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
      window.setTimeout(() => goldenBurst(0.5, 0.4), 320);
    }
  };

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 pb-20 pt-16 text-center sm:px-5">
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
        {REASONS.eyebrow}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 max-w-xl font-display text-[1.7rem] leading-snug text-soft sm:text-4xl"
      >
        {REASONS.heading}
      </motion.h2>

      {/* ------------------------------- the garden ------------------------------- */}
      <motion.button
        type="button"
        onClick={bloomNext}
        aria-label={complete ? "See the last line" : "Bloom another flower"}
        whileTap={{ scale: 0.98 }}
        className="relative mt-6 w-full max-w-md cursor-pointer rounded-[28px] bg-transparent px-2 py-3"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-6 h-24 rounded-full bg-rose/20 blur-[46px]"
        />
        <div className="relative grid grid-cols-5 justify-items-center gap-y-2">
          {REASONS.items.map((item, i) => {
            const open = i < revealed;
            return (
              <motion.span
                key={i}
                className="relative flex h-[54px] w-[54px] items-center justify-center sm:h-[62px] sm:w-[62px]"
                animate={open ? { scale: [0.6, 1.12, 1], rotate: [0, 6, 0] } : { scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {open ? (
                    <motion.span
                      key="bloom"
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Bloom kind={item.flower as BloomKind} id={`garden-${i}`} className="h-full w-full" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="bud"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex flex-col items-center"
                      aria-hidden="true"
                    >
                      {/* closed bud on a stem */}
                      <svg viewBox="0 0 24 34" className="h-7 w-5 opacity-45">
                        <path d="M12 30 C12 24 12 18 12 14" stroke="#3f7d5c" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M12 4 C16 8 16 14 12 17 C8 14 8 8 12 4 Z" fill="#ff8ac1" opacity="0.7" />
                        <path d="M12 17 C12 20 11 22 10 24" stroke="#3f7d5c" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
            );
          })}
        </div>

        <motion.p
          animate={{ opacity: revealed === 0 ? 0.85 : 0.45 }}
          className="relative mt-2 font-hand text-xl text-champagne"
        >
          {complete ? "the whole garden is in bloom" : REASONS.hint}
        </motion.p>

        {/* progress */}
        {revealed > 0 && (
          <p className="relative mt-1 text-[10px] uppercase tracking-[0.28em] text-soft/40">
            {revealed} / {TOTAL} {REASONS.counter}
          </p>
        )}
      </motion.button>

      {/* ------------------------------- the notes ------------------------------- */}
      <div className="mt-4 flex w-full max-w-xl flex-col gap-3">
        <AnimatePresence initial={false}>
          {REASONS.items.slice(0, revealed).map((item, i) => (
            <motion.article
              key={i}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.96, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 170, damping: 22 }}
              className="relative overflow-hidden rounded-3xl border border-soft/10 bg-plum/45 px-4 py-4 text-left backdrop-blur-md sm:px-5"
            >
              <div
                className="pointer-events-none absolute -left-10 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full blur-3xl"
                style={{ background: TINTS[i % TINTS.length] }}
              />
              <div className="relative flex items-start gap-3 sm:gap-4">
                {/* the note's own flower */}
                <motion.div
                  className="mt-0.5 h-12 w-12 shrink-0 sm:h-14 sm:w-14"
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 7 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Bloom kind={item.flower as BloomKind} id={`note-${i}`} className="h-full w-full" />
                </motion.div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="rounded-full border border-champagne/30 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-champagne/80">
                      {item.lang}
                    </span>
                    <span className="font-display text-[11px] text-soft/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {item.lines.map((line, k) => (
                    <p
                      key={k}
                      className="font-display text-[0.98rem] leading-relaxed text-soft/90 sm:text-[1.05rem]"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* ------------------------------- the finale ------------------------------- */}
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
