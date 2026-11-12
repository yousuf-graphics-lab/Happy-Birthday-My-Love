"use client";

// ---------------------------------------------------------------------------
// SCREEN 01 — THE MAGICAL WELCOME
// A midnight room, one ivory invitation: warm paper, a gold hairline frame,
// a rose-silk lining, a pressed flower at the corner and a wax seal with a
// heart pressed into it. Opening it breaks the seal, lifts the flap, slides
// the card out, releases golden light and starts the music before carrying
// her inside.
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
        animate={{ opacity: [0.3, 0.55, 0.3], scale: [0.94, 1.06, 0.94] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose/20 blur-[110px]"
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
        className="mt-6 font-display text-[1.9rem] leading-[1.14] tracking-tight text-soft sm:text-[2.9rem] md:text-[3.4rem]"
      >
        <span className="block text-[1.35rem] font-normal tracking-[0.18em] text-soft/60 sm:text-[1.7rem]">
          {WELCOME.headingTopLine}
        </span>
        <span className="mt-2 block text-soft/90">
          {WELCOME.headingLead}{" "}
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
          {WELCOME.headingTail}
        </span>
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
        className="relative mt-12 flex h-[300px] w-[300px] cursor-pointer items-center justify-center bg-transparent sm:h-[330px] sm:w-[340px] disabled:cursor-default"
      >
        {/* sparkle dust */}
        {[
          { l: "-2%", t: "20%", d: 0, s: 12 },
          { l: "94%", t: "34%", d: 1.2, s: 10 },
          { l: "6%", t: "76%", d: 2.1, s: 9 },
          { l: "88%", t: "84%", d: 0.6, s: 13 },
        ].map((sp, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute z-50"
            style={{ left: sp.l, top: sp.t, fontSize: sp.s }}
            animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3.6, delay: sp.d, repeat: Infinity, ease: "easeInOut" }}
          >
            ✨
          </motion.span>
        ))}

        {/* envelope stack — floats very gently */}
        <motion.div
          className="relative h-[204px] w-[268px] sm:h-[228px] sm:w-[300px]"
          style={{ perspective: "1400px" }}
          animate={phase === "closed" ? { y: [0, -5, 0] } : { y: 0 }}
          transition={
            phase === "closed"
              ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.6 }
          }
        >
          {/* shadow pool */}
          <div
            aria-hidden="true"
            className="absolute -bottom-5 left-1/2 h-7 w-[88%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl"
          />

          {/* ---------------- back panel — warm ivory invitation ---------------- */}
          <div className="absolute inset-0 overflow-hidden rounded-[12px] bg-[linear-gradient(158deg,#fdf8ee_0%,#f8ecd8_44%,#efdcc0_100%)] shadow-[0_36px_70px_-24px_rgba(0,0,0,0.95)] ring-1 ring-[#c9a76c]/45">
            {/* pressed damask */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden="true">
              <defs>
                <pattern id="envDamask" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path
                    d="M14 4 C18.5 8.5 18.5 14.5 14 19 C9.5 14.5 9.5 8.5 14 4 Z"
                    fill="#a87f42"
                  />
                  <circle cx="1.5" cy="1.5" r="1.5" fill="#a87f42" />
                  <circle cx="26.5" cy="26.5" r="1.5" fill="#a87f42" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#envDamask)" />
            </svg>

            {/* rose silk lining, glowing out of the mouth */}
            <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,#ff9dc0_0%,#ffc9dc_38%,rgba(255,233,240,0)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.55),transparent_65%)]" />

            {/* double gold frame */}
            <div className="pointer-events-none absolute inset-[9px] rounded-[8px] border border-[#b98f4b]/40" />
            <div className="pointer-events-none absolute inset-[13px] rounded-[7px] border border-[#b98f4b]/18" />
          </div>

          {/* ---------------- the card inside ---------------- */}
          <motion.div
            initial={false}
            animate={
              isOpen
                ? { y: -116, scale: 1.05, opacity: 1 }
                : isOpening
                ? { y: -50, scale: 1, opacity: 1 }
                : { y: 20, opacity: 0 }
            }
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute bottom-7 left-1/2 z-10 w-[204px] -translate-x-1/2 sm:w-[232px]"
          >
            <div className="relative overflow-hidden rounded-[9px] border border-[#c9a76c]/45 bg-[linear-gradient(160deg,#fffdf8_0%,#fdf2e4_60%,#f9e6d6_100%)] px-5 py-5 shadow-[0_20px_44px_-16px_rgba(0,0,0,0.85)]">
              <div className="pointer-events-none absolute inset-[6px] rounded-[6px] border border-[#c9a76c]/55" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.9),transparent_60%)]" />
              <div className="relative flex flex-col items-center">
                <Heart className="h-4 w-4 fill-rose text-rose" strokeWidth={1.4} />
                <p className="mt-2 font-hand text-[1.55rem] leading-none text-[#4a2a3f]">
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

          {/* ---------------- pocket front — three folds ---------------- */}
          <svg
            viewBox="0 0 300 228"
            className="absolute inset-0 z-20 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="pocketLeft" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fdf6e8" />
                <stop offset="100%" stopColor="#f0e0c6" />
              </linearGradient>
              <linearGradient id="pocketRight" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbf2e2" />
                <stop offset="100%" stopColor="#eadbbd" />
              </linearGradient>
              <linearGradient id="pocketBottom" x1="0" y1="0" x2="0.2" y2="1">
                <stop offset="0%" stopColor="#fff9ef" />
                <stop offset="100%" stopColor="#f3e4ca" />
              </linearGradient>
            </defs>
            <path
              d="M0 4 L150 112 L0 226 Z"
              fill="url(#pocketLeft)"
              stroke="rgba(176,138,78,0.4)"
              strokeWidth="1"
            />
            <path
              d="M300 4 L150 112 L300 226 Z"
              fill="url(#pocketRight)"
              stroke="rgba(176,138,78,0.4)"
              strokeWidth="1"
            />
            <path
              d="M2 226 L150 112 L298 226 Z"
              fill="url(#pocketBottom)"
              stroke="rgba(176,138,78,0.5)"
              strokeWidth="1"
            />
            {/* fold highlights */}
            <path d="M0 4 L150 112" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" fill="none" />
            <path d="M300 4 L150 112" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" fill="none" />
            {/* scalloped gold band along the bottom fold */}
            <path
              d="M40 208 Q56 196 72 208 Q88 220 104 208 Q120 196 136 208 Q152 220 168 208 Q184 196 200 208 Q216 220 232 208 Q248 196 264 208"
              fill="none"
              stroke="rgba(184,140,76,0.35)"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>

          {/* ---------------- flap — folds open, rose lining behind ---------------- */}
          <motion.div
            initial={false}
            animate={{ rotateX: isOpening ? -168 : 0 }}
            transition={{ duration: 0.85, ease: EASE }}
            style={{
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              zIndex: isOpening ? 5 : 30,
            }}
            className="absolute inset-x-0 top-0 h-[118px]"
          >
            {/* outer face */}
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden" }}
            >
              <svg
                viewBox="0 0 300 118"
                className="h-full w-full drop-shadow-[0_10px_18px_rgba(60,30,10,0.4)]"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="flapGrad" x1="0" y1="0" x2="0.4" y2="1">
                    <stop offset="0%" stopColor="#fdf7ea" />
                    <stop offset="60%" stopColor="#f7e9d2" />
                    <stop offset="100%" stopColor="#efdcc0" />
                  </linearGradient>
                </defs>
                <path
                  d="M2 2 L298 2 L150 114 Z"
                  fill="url(#flapGrad)"
                  stroke="rgba(184,140,76,0.5)"
                  strokeWidth="1.2"
                />
                <path
                  d="M16 9 L150 96 L284 9"
                  fill="none"
                  stroke="rgba(184,140,76,0.28)"
                  strokeWidth="1"
                />
                <path
                  d="M30 15 L150 86 L270 15"
                  fill="none"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* inner face — rose silk lining */}
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <svg viewBox="0 0 300 118" className="h-full w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="flapLining" x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0%" stopColor="#ffd7e4" />
                    <stop offset="55%" stopColor="#ffb0cb" />
                    <stop offset="100%" stopColor="#f07fa6" />
                  </linearGradient>
                </defs>
                <path
                  d="M2 2 L298 2 L150 114 Z"
                  fill="url(#flapLining)"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="1.2"
                />
                <path
                  d="M20 10 L150 92 L280 10"
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </motion.div>

          {/* ---------------- pressed sprig, bottom-left ---------------- */}
          <svg
            viewBox="0 0 64 64"
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 -left-3 z-40 h-[62px] w-[62px] -rotate-12 opacity-90 sm:h-[70px] sm:w-[70px]"
          >
            <path
              d="M30 58 C30 44 28 34 22 26"
              stroke="#6f8f6a"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx="24" cy="38" rx="7" ry="3" fill="#8aa984" opacity="0.85" transform="rotate(-28 24 38)" />
            <ellipse cx="33" cy="46" rx="7" ry="3" fill="#7d9c77" opacity="0.85" transform="rotate(24 33 46)" />
            <ellipse cx="19" cy="30" rx="6" ry="2.6" fill="#9ab894" opacity="0.8" transform="rotate(-48 19 30)" />
            <g opacity="0.95">
              <circle cx="21" cy="22" r="4.2" fill="#ffd7e4" />
              <circle cx="27" cy="17" r="3.4" fill="#ffe9f0" />
              <circle cx="15" cy="17" r="3" fill="#ffc2d8" />
              <circle cx="21" cy="22" r="1.3" fill="#e8a33d" />
            </g>
          </svg>

          {/* ---------------- pressed sprig, bottom-right ---------------- */}
          <svg
            viewBox="0 0 64 64"
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-3 -right-3 z-40 h-[54px] w-[54px] rotate-12 opacity-80 sm:h-[62px] sm:w-[62px]"
          >
            <path
              d="M34 58 C34 46 37 36 44 28"
              stroke="#6f8f6a"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx="39" cy="40" rx="6.5" ry="2.8" fill="#8aa984" opacity="0.85" transform="rotate(28 39 40)" />
            <ellipse cx="31" cy="47" rx="6" ry="2.6" fill="#7d9c77" opacity="0.8" transform="rotate(-24 31 47)" />
            <circle cx="45" cy="24" r="3.6" fill="#ffe9c4" />
            <circle cx="50" cy="29" r="2.8" fill="#fff7fb" />
            <circle cx="45" cy="24" r="1.1" fill="#e8a33d" />
          </svg>

          {/* ---------------- wax seal ---------------- */}
          <AnimatePresence>
            {!isOpening && (
              <motion.div
                key="seal"
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.2, rotate: 46, opacity: 0, y: 8 }}
                transition={{ type: "spring", stiffness: 190, damping: 16 }}
                className="absolute left-1/2 top-[80px] z-40 flex h-[58px] w-[58px] -translate-x-1/2 items-center justify-center rounded-full sm:h-[62px] sm:w-[62px]"
              >
                {/* gold rim */}
                <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_210deg,#f6d79a,#c99a4d,#ffe9c0,#b8863c,#f6d79a)] shadow-[0_10px_22px_-6px_rgba(0,0,0,0.9)]" />
                {/* wax body */}
                <span className="absolute inset-[4px] rounded-full bg-[radial-gradient(circle_at_34%_28%,#ff7fa8_0%,#e0396f_45%,#9e2350_100%)] shadow-[inset_0_2px_7px_rgba(255,255,255,0.4),inset_0_-3px_8px_rgba(80,0,25,0.55)]" />
                {/* pressed heart */}
                <Heart
                  className="relative h-[22px] w-[22px] fill-[#7d1038]/70 text-[#ffd9e6]/70 drop-shadow-[0_1px_0_rgba(255,255,255,0.35)] sm:h-6 sm:w-6"
                  strokeWidth={1.1}
                />
                {/* highlight */}
                <span className="absolute left-3 top-2 h-2 w-4 -rotate-[20deg] rounded-full bg-white/40 blur-[2px]" />
                {/* tiny orbit sparkles */}
                <motion.span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 text-[9px] text-champagne"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.15, 0.7] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✦
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* glow that escapes the envelope as it opens */}
          <AnimatePresence>
            {isOpening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.9, 0.55], scale: [0.6, 1.3, 1.15] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4 }}
                className="pointer-events-none absolute inset-x-0 top-0 z-30 h-28 bg-[radial-gradient(ellipse_at_center,rgba(255,220,170,0.6),transparent_70%)] blur-md"
              />
            )}
          </AnimatePresence>
        </motion.div>
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
