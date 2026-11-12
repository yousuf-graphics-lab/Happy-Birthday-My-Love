"use client";

// ---------------------------------------------------------------------------
// SCREEN 06 — A GARDEN OF TEN FLOWERS
// The garden is always in bloom: ten flowers, each one standing for a note.
// Touch a flower and its note opens beneath the garden. Once all ten have been
// read, the confetti falls and the last line appears.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Bloom, { type BloomKind } from "@/components/flowers/Bloom";
import MagicButton from "@/components/ui/MagicButton";
import { useAudio } from "@/components/AudioProvider";
import { REASONS } from "@/lib/content";
import { goldenBurst } from "@/lib/confetti";
import { firecrackers } from "@/lib/fireworks";

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
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  const [burst, setBurst] = useState(false);

  const complete = seen.length >= TOTAL;

  const pick = (i: number) => {
    setOpen(i);
    if (seen.includes(i)) {
      playSfx("click");
      return;
    }
    playSfx("chime");
    const next = [...seen, i];
    setSeen(next);
    if (next.length >= TOTAL) {
      setBurst(true);
      window.setTimeout(() => playSfx("celebration"), 240);
      window.setTimeout(() => goldenBurst(0.5, 0.38), 300);
      // the last note is read — send up the firecrackers
      window.setTimeout(() => playSfx("firework"), 620);
      window.setTimeout(() => firecrackers(8), 660);
    }
  };

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 pb-20 pt-16 sm:px-5">
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
        {REASONS.eyebrow}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 max-w-xl text-center font-display text-[1.7rem] leading-snug text-soft sm:text-4xl"
      >
        {REASONS.heading}
      </motion.h2>

      {/* ------------------------------- the garden ------------------------------- */}
      <div className="relative mt-7 w-full max-w-md">
        {/* garden light */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-32 rounded-[50%] bg-rose/20 blur-[52px]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 bottom-0 h-16 rounded-[50%] bg-champagne/10 blur-[40px]"
        />

        <div className="relative grid grid-cols-5 gap-1.5 rounded-[26px] border border-soft/10 bg-plum/35 px-2.5 py-4 backdrop-blur-md sm:gap-2.5 sm:px-4 sm:py-5">
          {REASONS.items.map((item, i) => {
            const active = open === i;
            const read = seen.includes(i);
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => pick(i)}
                aria-label={`Note ${i + 1} — ${item.lang}`}
                aria-pressed={active}
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 170, damping: 15 }}
                whileHover={{ scale: 1.09, y: -4 }}
                whileTap={{ scale: 0.94 }}
                className="group relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-champagne/60"
              >
                {/* halo behind the chosen flower */}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full"
                  animate={
                    active
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.6 }
                  }
                  transition={{ duration: 0.45 }}
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(255,217,160,0.38), rgba(255,77,141,0.18) 55%, transparent 72%)",
                  }}
                />

                {/* the flower — always in bloom */}
                <motion.span
                  className="relative block h-full w-full p-[3px] sm:p-1"
                  animate={{ rotate: active ? [-2, 2] : [-1.6, 1.6] }}
                  transition={{
                    duration: 5 + i * 0.35,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "50% 80%" }}
                >
                  <Bloom kind={item.flower as BloomKind} id={`garden-${i}`} className="h-full w-full" />
                </motion.span>

                {/* number stamp */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 font-display text-[9px] tracking-[0.14em] transition-colors sm:text-[10px] ${
                    active || read ? "text-champagne/90" : "text-soft/35"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* read tick */}
                {read && !active && (
                  <motion.span
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="pointer-events-none absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-champagne/80 shadow-[0_0_6px_rgba(255,217,160,0.9)]"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <p className="mt-4 font-hand text-xl text-champagne/85">
          {complete ? "every flower has told its story" : REASONS.hint}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-soft/40">
          {seen.length} / {TOTAL} {REASONS.counter}
        </p>
      </div>

      {/* ------------------------------- the opened note ------------------------------- */}
      <div className="relative mt-6 min-h-[188px] w-full max-w-xl sm:min-h-[172px]">
        <AnimatePresence initial={false}>
          {open === null ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full min-h-[150px] items-center justify-center rounded-3xl border border-dashed border-soft/15 px-6"
            >
              <p className="font-hand text-lg text-soft/45">
                the notes are hiding inside the flowers…
              </p>
            </motion.div>
          ) : (
            <motion.article
              key={`note-${open}`}
              initial={{ opacity: 0, y: 16, scale: 0.97, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="relative overflow-hidden rounded-3xl border border-champagne/20 bg-plum/55 px-4 py-5 text-left shadow-[0_18px_44px_-26px_rgba(0,0,0,0.95)] backdrop-blur-md sm:px-6"
            >
              <div
                className="pointer-events-none absolute -left-12 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full blur-3xl"
                style={{ background: TINTS[open % TINTS.length] }}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />

              <div className="relative flex items-start gap-3 sm:gap-4">
                {/* the note's own flower */}
                <motion.div
                  className="mt-0.5 h-12 w-12 shrink-0 sm:h-16 sm:w-16"
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Bloom
                    kind={REASONS.items[open].flower as BloomKind}
                    id={`note-${open}`}
                    className="h-full w-full"
                  />
                </motion.div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full border border-champagne/30 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-champagne/80">
                      {REASONS.items[open].lang}
                    </span>
                    <span className="font-display text-[11px] text-soft/35">
                      {String(open + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {REASONS.items[open].lines.map((line, k) => (
                    <p
                      key={k}
                      className="font-display text-[0.96rem] leading-relaxed text-soft/90 sm:text-[1.06rem]"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* petal flutter along the foot of the card */}
              <div className="relative mt-3 flex items-center gap-1.5">
                <span className="h-px flex-1 bg-gradient-to-r from-champagne/40 to-transparent" />
                <span className="text-[9px] text-champagne/50">❀</span>
                <span className="h-px flex-1 bg-gradient-to-l from-champagne/40 to-transparent" />
              </div>
            </motion.article>
          )}
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
            <div className="glass-gold relative overflow-hidden rounded-[26px] px-7 py-6 text-center">
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
