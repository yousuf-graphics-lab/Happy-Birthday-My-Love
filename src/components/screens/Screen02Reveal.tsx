"use client";

// ---------------------------------------------------------------------------
// SCREEN 02 — THE GRAND BIRTHDAY REVEAL
// Interactive cake with microphone-based candle blowing + tap-to-blow.
// Blowing out all candles triggers confetti, hearts, a magical chime and the
// wish message.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Mic, MicOff, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import BirthdayCake from "@/components/cake/BirthdayCake";
import MagicButton from "@/components/ui/MagicButton";
import { useAudio } from "@/components/AudioProvider";
import { useBreathDetector } from "@/hooks/useBreathDetector";
import { REVEAL } from "@/lib/content";
import { celebrationBurst } from "@/lib/confetti";

const CANDLE_COUNT = 5;

export default function Screen02Reveal({ onContinue }: { onContinue: () => void }) {
  const { playSfx } = useAudio();
  const [candles, setCandles] = useState<boolean[]>(() =>
    Array(CANDLE_COUNT).fill(true)
  );
  const [celebrating, setCelebrating] = useState(false);

  // Refs keep the mic callback and the click handlers reading fresh state
  // without re-subscribing anything.
  const candlesRef = useRef(candles);
  const celebratingRef = useRef(celebrating);
  candlesRef.current = candles;
  celebratingRef.current = celebrating;

  const blownCount = candles.filter((c) => !c).length;

  const finish = () => {
    if (celebratingRef.current) return;
    celebratingRef.current = true;
    setCelebrating(true);
    playSfx("blow");
    window.setTimeout(() => playSfx("celebration"), 300);
    window.setTimeout(() => celebrationBurst(), 420);
  };

  const applyCandles = (next: boolean[]) => {
    candlesRef.current = next;
    setCandles(next);
    if (!next.some(Boolean)) finish();
    else playSfx("blow");
  };

  const blowCandle = (index: number) => {
    const prev = candlesRef.current;
    if (celebratingRef.current || !prev[index]) return;
    applyCandles(prev.map((lit, i) => (i === index ? false : lit)));
  };

  const blowAll = () => {
    if (celebratingRef.current || !candlesRef.current.some(Boolean)) return;
    applyCandles(Array(CANDLE_COUNT).fill(false));
  };

  const detector = useBreathDetector(() => {
    if (celebratingRef.current) return;
    const firstLit = candlesRef.current.findIndex(Boolean);
    if (firstLit === -1) return;
    blowCandle(firstLit);
  });

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5 py-20 text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="eyebrow"
      >
        {REVEAL.eyebrow}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mt-6 max-w-xs font-sans text-[10px] font-medium uppercase leading-relaxed tracking-[0.26em] text-champagne/85 sm:max-w-none sm:text-xs sm:tracking-[0.4em]"
      >
        {REVEAL.headingTop}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, scale: 0.86, filter: "blur(14px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.6, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 font-display text-[3.4rem] font-bold leading-[0.95] tracking-tight sm:text-[5.25rem]"
      >
        <span className="text-gradient-shimmer">{REVEAL.headingName}</span>
      </motion.h2>

      {/* gold ornament under the name */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.3 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="mt-5 flex items-center gap-3"
      >
        <div className="h-px w-14 bg-gradient-to-r from-transparent to-champagne/70 sm:w-20" />
        <motion.span
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-lg"
        >
          {REVEAL.headingTail}
        </motion.span>
        <div className="h-px w-14 bg-gradient-to-l from-transparent to-champagne/70 sm:w-20" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-5 max-w-md text-base leading-relaxed text-soft/70 sm:text-lg"
      >
        {REVEAL.supporting}
      </motion.p>

      {/* the cake */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10"
      >
        <BirthdayCake litCandles={candles} celebrating={celebrating} />
      </motion.div>

      {/* candle prompt / wish message */}
      <AnimatePresence mode="wait">
        {!celebrating ? (
          <motion.p
            key="prompt"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mt-10 max-w-sm text-lg text-soft/80"
          >
            {REVEAL.cakePrompt}
          </motion.p>
        ) : (
          <motion.div
            key="wish"
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 190, damping: 22 }}
            className="relative mt-10 w-full max-w-md"
          >
            <div className="glass-gold relative overflow-hidden rounded-[26px] px-7 py-7 text-center shadow-[0_30px_70px_-30px_rgba(255,217,160,0.55)]">
              {/* foil edges */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-champagne/50 to-transparent" />
              {/* floating sparkles */}
              {[
                { l: "8%", t: "18%", d: 0 },
                { l: "90%", t: "26%", d: 0.8 },
                { l: "16%", t: "78%", d: 1.5 },
                { l: "84%", t: "72%", d: 2.1 },
              ].map((sp, i) => (
                <motion.span
                  key={i}
                  className="pointer-events-none absolute text-xs"
                  style={{ left: sp.l, top: sp.t }}
                  animate={{ opacity: [0.15, 0.95, 0.15], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 3.4, delay: sp.d, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✨
                </motion.span>
              ))}

              <motion.div
                initial={{ rotate: -10, scale: 0.4 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, delay: 0.15 }}
                className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-rose/35 to-violet/35 text-xl shadow-[0_0_26px_-6px_rgba(255,77,141,0.9)]"
              >
                🎂
              </motion.div>

              <p className="font-display text-[1.35rem] leading-snug text-soft text-shadow-glow sm:text-2xl">
                {REVEAL.wishMessage}
              </p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-3 font-hand text-xl text-champagne/90"
              >
                your wish has been heard
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* blow controls */}
      {!celebrating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <button
            type="button"
            onClick={detector.start}
            className="group inline-flex items-center gap-2 rounded-full border border-soft/20 bg-soft/5 px-5 py-2.5 text-sm text-soft/80 transition hover:border-rose/40 hover:text-soft"
          >
            {detector.listening ? (
              <Mic className="h-4 w-4 animate-pulse text-rose" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            {detector.listening ? REVEAL.micListening : REVEAL.micButton}
          </button>

          {detector.error && (
            <p className="max-w-xs text-sm text-rose/80">{REVEAL.micError}</p>
          )}

          <p className="text-xs text-soft/45">{REVEAL.blowHint}</p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {candles.map((lit, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Blow candle ${i + 1}`}
                onClick={() => blowCandle(i)}
                disabled={!lit}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-soft/15 bg-plum/60 text-xl transition hover:scale-110 hover:border-rose/50 disabled:opacity-25"
              >
                {lit ? "🔥" : "💨"}
              </button>
            ))}
          </div>

          {blownCount > 0 && blownCount < CANDLE_COUNT && (
            <button
              type="button"
              onClick={blowAll}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-champagne/90 underline-offset-4 transition hover:underline"
            >
              <Sparkles className="h-4 w-4" />
              {REVEAL.blowAll}
            </button>
          )}
        </motion.div>
      )}

      {/* continue */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: celebrating ? 2.2 : 2.4 }}
        className="mt-12"
      >
        <MagicButton onClick={onContinue} tone="gold">
          <Heart className="h-4 w-4 fill-current" strokeWidth={1.5} />
          {REVEAL.continue}
        </MagicButton>
      </motion.div>
    </section>
  );
}
