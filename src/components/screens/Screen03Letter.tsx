"use client";

// ---------------------------------------------------------------------------
// SCREEN 03 — A LETTER FROM MY HEART
// Midnight stationery with ruled paper, a wax seal and a letter that writes
// itself: paragraphs arrive word by word in Caveat, then the signature inks
// in with a flourish underneath.
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

  // Reveal paragraphs one at a time, like the letter is being written.
  useEffect(() => {
    if (revealed >= LETTER.paragraphs.length) return;
    const t = window.setTimeout(() => {
      setRevealed((r) => r + 1);
      playSfx("sparkle");
    }, revealed === 0 ? 650 : 1700);
    return () => window.clearTimeout(t);
  }, [revealed, playSfx]);

  const signatureRevealed = revealed >= LETTER.paragraphs.length;

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
        initial={{ opacity: 0, y: 40, rotateX: 14 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative mt-10 w-full max-w-xl"
      >
        {/* stacked paper behind the sheet */}
        <div className="absolute inset-x-3 -top-2 h-full rounded-[28px] bg-plum/40 blur-[1px]" />
        <div className="absolute inset-x-1.5 -top-1 h-full rounded-[28px] bg-[#1a1030]/70" />

        <div className="relative overflow-hidden rounded-[28px] border border-champagne/25 bg-gradient-to-br from-[#20143a] via-[#180e2c] to-[#120a21] p-7 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.95)] sm:p-10">
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

          {/* floating accents */}
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

          {/* wax seal */}
          <motion.div
            initial={{ scale: 0, rotate: -40, opacity: 0 }}
            animate={
              signatureRevealed
                ? { scale: 1, rotate: 0, opacity: 1 }
                : { scale: 0, rotate: -40, opacity: 0 }
            }
            transition={{ type: "spring", stiffness: 170, damping: 15 }}
            className="absolute -bottom-5 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose via-[#d63a76] to-violet shadow-[0_10px_26px_-8px_rgba(0,0,0,0.9),inset_0_2px_6px_rgba(255,255,255,0.35)] ring-1 ring-champagne/40"
            aria-hidden="true"
          >
            <span className="font-display text-xl text-soft/95 drop-shadow">Y</span>
            <span className="absolute inset-1 rounded-full border border-white/15" />
          </motion.div>
        </div>
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

// A paragraph that inks in word by word once it becomes active. Every word
// is laid out from the start, so the card never jumps as the letter grows.
function InkParagraph({ text, active }: { text: string; active: boolean }) {
  const words = text.split(" ");

  return (
    <p className="mb-3 font-hand text-[1.55rem] leading-[1.55] text-soft/90 sm:text-[1.8rem]">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block whitespace-pre"
          initial={false}
          animate={
            active
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 5, filter: "blur(4px)" }
          }
          transition={
            active
              ? {
                  duration: 0.42,
                  delay: i * 0.032,
                  ease: [0.22, 1, 0.36, 1],
                }
              : { duration: 0.2 }
          }
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

function SignatureBlock({ visible, name }: { visible: boolean; name: string }) {
  return (
    <motion.div
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.9, delay: visible ? 0.25 : 0 }}
      className="mt-6"
      aria-hidden={!visible}
    >
      <div className="mb-3 flex items-center gap-3">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
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
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 1 }}
          className="h-px flex-1 bg-gradient-to-l from-transparent to-champagne/60"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -14, rotate: -2 }}
        animate={{ opacity: 1, x: 0, rotate: -1.5 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
