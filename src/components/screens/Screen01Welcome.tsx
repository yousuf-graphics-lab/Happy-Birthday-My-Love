"use client";

// ---------------------------------------------------------------------------
// SCREEN 01 — THE MAGICAL WELCOME
// A midnight envelope: gold-hairline paper, a folded flap, a pressed wax seal
// and a card addressed to her waiting inside. Opening it breaks the seal,
// lifts the flap, slides the card out, releases golden light and starts the
// music before carrying her inside.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useAudio } from "@/components/AudioProvider";
import MagicButton from "@/components/ui/MagicButton";
import { WELCOME } from "@/lib/content";
import { goldenBurst } from "@/lib/confetti";

type Phase = "closed" | "opening" | "opened";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Screen01Welcome({ onContinue }: { onContinue: () => void }) {
  const { startMusic, playSfx } = useAudio();
  const [phase, setPhase] = useState<Phase>("closed");

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    playSfx("envelope");

    window.setTimeout(() => {
      goldenBurst(0.5, 0.44);
      playSfx("sparkle");
    }, 560);
    window.setTimeout(() => startMusic(), 900);
    window.setTimeout(() => setPhase("opened"), 1350);
    window.setTimeout(() => onContinue(), 3100);
  };

  const isOpening = phase !== "closed";
  const isOpen = phase === "opened";

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5 py-24 text-center">
      {/* warm light behind the envelope */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0.35, scale: 0.9 }}
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose/20 blur-[110px]"
      />

      {/* eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="eyebrow"
      >
        {WELCOME.eyebrow}
      </motion.p>

      {/* heading — her name carries the foil */}
      <motion.h1
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
        className="mt-6 font-display text-[2.7rem] leading-[1.08] tracking-tight text-soft sm:text-6xl"
      >
        <span className="text-soft/85">{WELCOME.headingLead} </span>
        <span className="relative inline-block">
          <span className="text-gradient-shimmer italic">{WELCOME.headingName}</span>
          {/* soft underline flourish */}
          <motion.svg
            viewBox="0 0 200 18"
            className="absolute -bottom-2 left-0 h-3 w-full text-champagne/70"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M3 12c40-6 92-8 132-4 22 2 40 3 62-1"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.2, duration: 1.4, ease: "easeInOut" }}
            />
          </motion.svg>
        </span>
        <span className="text-soft/85">{WELCOME.headingTail}</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.75 }}
        className="mt-8 max-w-sm text-[0.95rem] leading-relaxed text-soft/65 sm:text-base"
      >
        {WELCOME.supporting}
      </motion.p>

      {/* ------------------------------- envelope ------------------------------- */}
      <motion.button
        type="button"
        onClick={open}
        disabled={phase !== "closed"}
        aria-label="Open your surprise"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1, ease: EASE }}
        whileHover={phase === "closed" ? { scale: 1.03, y: -4 } : undefined}
        whileTap={phase === "closed" ? { scale: 0.98 } : undefined}
        className="relative mt-12 flex h-[280px] w-[260px] cursor-pointer items-end justify-center bg-transparent sm:h-[310px] sm:w-[300px] disabled:cursor-default"
      >
        {/* sparkle dust */}
        {[
          { l: "-6%", t: "18%", d: 0, s: 12 },
          { l: "96%", t: "30%", d: 1.2, s: 10 },
          { l: "4%", t: "72%", d: 2.1, s: 9 },
          { l: "88%", t: "80%", d: 0.6, s: 13 },
        ].map((sp, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{ left: sp.l, top: sp.t, fontSize: sp.s }}
            animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3.6, delay: sp.d, repeat: Infinity, ease: "easeInOut" }}
          >
            ✨
          </motion.span>
        ))}

        {/* envelope stack */}
        <div className="relative h-[196px] w-[248px] sm:w-[282px]" style={{ perspective: "1200px" }}>
          {/* body */}
          <div className="absolute inset-0 overflow-hidden rounded-[10px] bg-gradient-to-br from-[#2a1a44] via-[#20123a] to-[#170d2a] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.95)] ring-1 ring-champagne/20">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.07]" />
          </div>

          {/* the card inside — rises out once the flap is open */}
          <motion.div
            initial={false}
            animate={
              isOpen
                ? { y: -108, scale: 1.04, opacity: 1 }
                : isOpening
                ? { y: -46, scale: 1, opacity: 1 }
                : { y: 18, opacity: 0 }
            }
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute bottom-6 left-1/2 z-10 w-[196px] -translate-x-1/2 sm:w-[224px]"
          >
            <div className="relative overflow-hidden rounded-[8px] border border-champagne/40 bg-gradient-to-br from-[#fffaf3] via-[#fbeee2] to-[#f6dfd0] px-5 py-5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.85)]">
              {/* gold inner rule */}
              <div className="pointer-events-none absolute inset-[6px] rounded-[5px] border border-champagne/60" />
              <div className="relative flex flex-col items-center">
                <Heart className="h-4 w-4 fill-rose text-rose" strokeWidth={1.4} />
                <p className="mt-2 font-hand text-[1.6rem] leading-none text-[#4a2a3f]">
                  {WELCOME.cardTo}
                </p>
                <div className="my-2 flex w-full items-center gap-2">
                  <span className="h-px flex-1 bg-[#4a2a3f]/20" />
                  <span className="text-[9px] text-[#4a2a3f]/50">❦</span>
                  <span className="h-px flex-1 bg-[#4a2a3f]/20" />
                </div>
                <p className="font-hand text-base leading-tight text-[#4a2a3f]/80">
                  {WELCOME.cardNote}
                </p>
                <p className="mt-1 font-hand text-lg text-[#8d3f63]">
                  {WELCOME.cardSignature}
                </p>
              </div>
            </div>
          </motion.div>

          {/* pocket front — three folds */}
          <svg
            viewBox="0 0 280 196"
            className="absolute inset-0 z-20 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="pocketLeft" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3a2259" />
                <stop offset="100%" stopColor="#26163f" />
              </linearGradient>
              <linearGradient id="pocketRight" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#402659" />
                <stop offset="100%" stopColor="#291841" />
              </linearGradient>
              <linearGradient id="pocketBottom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#452c63" />
                <stop offset="100%" stopColor="#2b1a45" />
              </linearGradient>
            </defs>
            <path d="M0 4 L140 104 L0 192 Z" fill="url(#pocketLeft)" stroke="rgba(255,217,160,0.18)" strokeWidth="1" />
            <path d="M280 4 L140 104 L280 192 Z" fill="url(#pocketRight)" stroke="rgba(255,217,160,0.18)" strokeWidth="1" />
            <path d="M2 192 L140 104 L278 192 Z" fill="url(#pocketBottom)" stroke="rgba(255,217,160,0.25)" strokeWidth="1" />
            <path d="M0 4 L140 104" stroke="rgba(255,217,160,0.28)" strokeWidth="1" fill="none" />
            <path d="M280 4 L140 104" stroke="rgba(255,217,160,0.28)" strokeWidth="1" fill="none" />
          </svg>

          {/* flap — folds open */}
          <motion.div
            initial={false}
            animate={{ rotateX: isOpening ? -168 : 0 }}
            transition={{ duration: 0.85, ease: EASE }}
            style={{
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              zIndex: isOpening ? 5 : 30,
              backfaceVisibility: "hidden",
            }}
            className="absolute inset-x-0 top-0 h-[104px]"
          >
            <svg viewBox="0 0 280 104" className="h-full w-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]" aria-hidden="true">
              <defs>
                <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a2e6b" />
                  <stop offset="100%" stopColor="#331f4d" />
                </linearGradient>
              </defs>
              <path d="M2 2 L278 2 L140 100 Z" fill="url(#flapGrad)" stroke="rgba(255,217,160,0.28)" strokeWidth="1.2" />
              <path d="M14 8 L140 84 L266 8" fill="none" stroke="rgba(255,217,160,0.12)" strokeWidth="1" />
            </svg>
          </motion.div>

          {/* wax seal */}
          <AnimatePresence>
            {!isOpening && (
              <motion.div
                key="seal"
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.2, rotate: 46, opacity: 0, y: 8 }}
                transition={{ type: "spring", stiffness: 190, damping: 16 }}
                className="absolute left-1/2 top-[74px] z-40 flex h-[54px] w-[54px] -translate-x-1/2 items-center justify-center rounded-full sm:h-[58px] sm:w-[58px]"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff6fa3] via-[#e33f7b] to-[#9d3ec9] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.9),inset_0_2px_6px_rgba(255,255,255,0.4)]" />
                <span className="absolute inset-[5px] rounded-full border border-white/25" />
                <span className="absolute inset-[10px] rounded-full border border-white/15" />
                <span className="relative font-display text-lg font-bold text-soft/95 drop-shadow-sm sm:text-xl">
                  S
                </span>
                {/* highlight */}
                <span className="absolute left-3 top-2 h-2 w-4 -rotate-[20deg] rounded-full bg-white/35 blur-[2px]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* glow that escapes the envelope as it opens */}
          <AnimatePresence>
            {isOpening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.9, 0.55], scale: [0.6, 1.25, 1.1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4 }}
                className="pointer-events-none absolute inset-x-0 top-0 z-30 h-24 bg-[radial-gradient(ellipse_at_center,rgba(255,217,160,0.55),transparent_70%)] blur-md"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* ------------------------------- button ------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="mt-12 flex flex-col items-center"
      >
        <MagicButton onClick={open} disabled={phase !== "closed"}>
          {phase === "closed" ? (
            <>
              <Heart className="h-4 w-4 fill-current" strokeWidth={1.6} />
              {WELCOME.button}
            </>
          ) : phase === "opening" ? (
            "Unwrapping…"
          ) : (
            "Taking you inside…"
          )}
        </MagicButton>

        <motion.p
          animate={{ opacity: phase === "closed" ? 0.45 : 0 }}
          transition={{ duration: 0.6 }}
          className="mt-4 text-[11px] uppercase tracking-[0.32em] text-soft/60"
        >
          {WELCOME.hint}
        </motion.p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ delay: 1.9, duration: 1 }}
        className="mt-8 font-hand text-lg text-soft/70"
      >
        made with love, just for you
      </motion.p>
    </section>
  );
}
