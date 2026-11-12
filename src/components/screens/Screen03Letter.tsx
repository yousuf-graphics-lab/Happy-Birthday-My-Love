"use client";

// ---------------------------------------------------------------------------
// SCREEN 03 — A LETTER FROM MY HEART
// Midnight stationery with ruled paper and a wax monogram. The letter writes
// itself: every word inks in with a soft blur-lift, a warm sheen sweeps each
// line as it finishes, and the signature arrives last in a flourish.
// ---------------------------------------------------------------------------

import { motion } from "framer-motion";
import { Heart, Feather } from "lucide-react";
import { useEffect, useState } from "react";
import MagicButton from "@/components/ui/MagicButton";
import { useAudio } from "@/components/AudioProvider";
import { LETTER } from "@/lib/content";

export default function Screen03Letter({ onContinue }: { onContinue: () => void }) {
  const { playSfx } = useAudio();
  const [revealed, setRevealed] = useState(0);

  const signatureRevealed = revealed >= LETTER.paragraphs.length;

  // Reveal paragraphs one at a time, pacing each one by how long it takes to
  // write, so a long paragraph is never rushed and a short one never drags.
  useEffect(() => {
    if (revealed >= LETTER.paragraphs.length) return;
    const words = LETTER.paragraphs[revealed].split(" ").length;
    const wait = revealed === 0 ? 620 : Math.min(2600, 780 + words * 62);
    const t = window.setTimeout(() => {
      setRevealed((r) => r + 1);
      playSfx(revealed === 0 ? "sparkle" : "click");
    }, wait);
    return () => window.clearTimeout(t);
  }, [revealed, playSfx]);

  // the signature gets its own chime, once
  useEffect(() => {
    if (!signatureRevealed) return;
    const t = window.setTimeout(() => playSfx("chime"), 420);
    return () => window.clearTimeout(t);
  }, [signatureRevealed, playSfx]);

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5 py-20">
      {/* soft warm light behind the letter */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[80vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="eyebrow"
      >
        from my heart to yours
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-4 text-center font-display text-4xl text-soft sm:text-5xl"
      >
        {LETTER.heading}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 44, rotateX: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative mt-10 w-full max-w-xl"
      >
        {/* stacked paper behind the sheet */}
        <div className="absolute inset-x-3 -top-2 h-full rounded-[28px] bg-plum/40 blur-[1px]" />
        <div className="absolute inset-x-1.5 -top-1 h-full rounded-[28px] bg-[#1a1030]/70" />

        <div className="relative overflow-hidden rounded-[28px] border border-champagne/25 bg-gradient-to-br from-[#20143a] via-[#180e2c] to-[#120a21] p-7 pb-9 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.95)] sm:p-10 sm:pb-12">
          {/* paper texture + rules */}
          <div className="paper-grain pointer-events-none absolute inset-0 opacity-70" />
          <div className="paper-lines pointer-events-none absolute inset-0 opacity-60" />
          {/* margin rule, like a letter pad */}
          <div className="pointer-events-none absolute inset-y-6 left-5 w-px bg-rose/25 sm:left-7" />
          {/* foil edge highlights */}
          <div className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0_0_70px_-24px_rgba(255,77,141,0.35)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />

          {/* corner flourishes */}
          <svg viewBox="0 0 40 40" className="absolute left-1.5 top-1.5 h-10 w-10 text-champagne/35" aria-hidden="true">
            <path d="M2 38V20C2 20 6 18 12 16C18 14 20 10 20 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <svg viewBox="0 0 40 40" className="absolute bottom-1.5 right-1.5 h-10 w-10 rotate-180 text-champagne/35" aria-hidden="true">
            <path d="M2 38V20C2 20 6 18 12 16C18 14 20 10 20 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>

          {/* floating heart */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute right-7 top-7 text-rose/60"
            animate={{ y: [0, -8, 0], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            💗
          </motion.span>

          <div className="relative pl-4 sm:pl-6">
            {LETTER.paragraphs.map((para, i) => (
              <InkParagraph key={i} text={para} active={i < revealed} />
            ))}

            <SignatureBlock visible={signatureRevealed} name={LETTER.signature} />
          </div>
        </div>

        {/* the wax monogram sits outside the sheet, so nothing clips it */}
        <motion.div
          initial={{ scale: 0, rotate: -40, opacity: 0 }}
          animate={
            signatureRevealed
              ? { scale: 1, rotate: 0, opacity: 1 }
              : { scale: 0, rotate: -40, opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 170, damping: 15 }}
          className="absolute -bottom-6 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose via-[#d63a76] to-violet shadow-[0_10px_26px_-8px_rgba(0,0,0,0.9),inset_0_2px_6px_rgba(255,255,255,0.35)] ring-1 ring-champagne/40 sm:-bottom-7 sm:right-6 sm:h-16 sm:w-16"
          aria-hidden="true"
        >
          <span className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#ff7fa8]/40 to-transparent" />
          <span className="relative font-display text-xl text-soft/95 drop-shadow sm:text-2xl">Y</span>
          <span className="absolute inset-1 rounded-full border border-white/20" />
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ opacity: signatureRevealed ? 1 : 0.4 }}
        transition={{ duration: 0.8 }}
        className="mt-14"
      >
        <MagicButton onClick={onContinue} disabled={!signatureRevealed} tone="gold">
          <Feather className="h-4 w-4" strokeWidth={1.6} />
          {LETTER.continue}
        </MagicButton>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

// A paragraph that inks in word by word once it becomes active. Every word is
// laid out from the start, so the card never jumps as the letter grows; the
// blur-lift plus a jittered stagger makes it feel hand-written rather than
// mechanical, and a warm sheen passes over the line as it finishes.
function InkParagraph({ text, active }: { text: string; active: boolean }) {
  const words = text.split(" ");
  const step = 0.052;
  const finish = words.length * step + 0.55;

  return (
    <div className="relative mb-3">
      <p className="relative font-hand text-[1.5rem] leading-[1.6] text-soft/90 sm:text-[1.75rem]">
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block whitespace-pre"
            initial={false}
            animate={
              active
                ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, y: 9, scale: 0.955, filter: "blur(7px)" }
            }
            transition={
              active
                ? {
                    duration: 0.8,
                    delay: i * step + ((i * 7) % 3) * 0.013,
                    ease: [0.16, 1, 0.3, 1],
                  }
                : { duration: 0.24, ease: "easeOut" }
            }
            style={{ transformOrigin: "50% 90%" }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </p>

      {/* warm sheen that sweeps across the line once it has been written */}
      {active && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.9, delay: finish - 0.3, ease: "easeInOut" }}
        >
          <motion.span
            className="absolute inset-y-0 w-1/2 bg-[linear-gradient(100deg,transparent,rgba(255,217,160,0.16),transparent)]"
            initial={{ x: "-120%" }}
            animate={{ x: "260%" }}
            transition={{ duration: 1.9, delay: finish - 0.3, ease: "easeInOut" }}
          />
        </motion.span>
      )}
    </div>
  );
}

function SignatureBlock({ visible, name }: { visible: boolean; name: string }) {
  return (
    <motion.div
      initial={false}
      animate={
        visible
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 12, filter: "blur(8px)" }
      }
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6"
      aria-hidden={!visible}
    >
      <div className="mb-3 flex items-center gap-3">
        <motion.div
          initial={false}
          animate={{ scaleX: visible ? 1 : 0 }}
          transition={{ duration: 1.2, delay: visible ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="h-px flex-1 bg-gradient-to-r from-transparent to-champagne/60"
        />
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="h-4 w-4 fill-rose text-rose" strokeWidth={1.5} />
        </motion.span>
        <motion.div
          initial={false}
          animate={{ scaleX: visible ? 1 : 0 }}
          transition={{ duration: 1.2, delay: visible ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 1 }}
          className="h-px flex-1 bg-gradient-to-l from-transparent to-champagne/60"
        />
      </div>

      <motion.div
        initial={false}
        animate={visible ? { opacity: 1, x: 0, rotate: -1.5 } : { opacity: 0, x: -16, rotate: -4 }}
        transition={{ delay: visible ? 0.28 : 0, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative inline-block"
      >
        <p className="font-hand text-4xl text-champagne drop-shadow-[0_0_18px_rgba(255,217,160,0.35)] sm:text-5xl">
          {name}
        </p>
        {/* ink flourish under the signature */}
        <svg
          viewBox="0 0 200 24"
          className="absolute -bottom-3 left-0 h-4 w-full text-champagne/70"
          fill="none"
          aria-hidden="true"
        >
          <motion.path
            d="M4 14c34-9 74-11 108-6 20 3 48 8 84-2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={false}
            animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ delay: visible ? 0.7 : 0, duration: 1.2, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
