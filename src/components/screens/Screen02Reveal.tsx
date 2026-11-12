"use client";

// ---------------------------------------------------------------------------
// SCREEN 02 — THE GRAND BIRTHDAY REVEAL
// Interactive cake with microphone-based candle blowing + tap-to-blow.
// Blowing out all candles triggers confetti, hearts, a magical chime and the
// wish message.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Mic, MicOff, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
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

  // staggered gradient animation on the name
  const nameStyle = useMemo(
    () => ({
      backgroundImage:
        "linear-gradient(100deg,#ff4d8d,#a855f7,#ff4d8d)",
      backgroundSize: "200% auto",
    }),
    []
  );

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5 py-20 text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="eyebrow"
      >
        {REVEAL.eyebrow}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.15 }}
        className="mt-4 font-display text-4xl leading-tight text-soft sm:text-5xl"
      >
        {REVEAL.headingTop}
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="font-display text-5xl font-bold sm:text-6xl"
          style={nameStyle}
        >
          <span className="animate-shimmer bg-clip-text text-transparent">
            {REVEAL.headingName}
          </span>
        </motion.span>
        {REVEAL.headingTail}
      </motion.h2>

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
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <motion.div
              initial={{ rotate: -8, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="text-4xl"
            >
              🎂
            </motion.div>
            <p className="max-w-sm font-display text-2xl text-gradient-gold text-shadow-glow sm:text-3xl">
              {REVEAL.wishMessage}
            </p>
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
