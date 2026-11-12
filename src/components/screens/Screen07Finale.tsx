"use client";

// ---------------------------------------------------------------------------
// SCREEN 07 — THE FINAL BIRTHDAY SURPRISE
// Giant aurora, glowing heart, message revealed line by line, grand final
// heading, signature, final confetti and a replay button that restarts the
// whole experience.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import BirthdayCake from "@/components/cake/BirthdayCake";
import MagicButton from "@/components/ui/MagicButton";
import { useAudio } from "@/components/AudioProvider";
import { FINALE } from "@/lib/content";
import { finaleBurst } from "@/lib/confetti";

export default function Screen07Finale({ onReplay }: { onReplay: () => void }) {
  const { playSfx } = useAudio();
  const [line, setLine] = useState(0);
  const [grand, setGrand] = useState(false);

  // Reveal the message line by line.
  useEffect(() => {
    if (line >= FINALE.lines.length) {
      const t = window.setTimeout(() => {
        setGrand(true);
        playSfx("chime");
        finaleBurst();
      }, 500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setLine((l) => l + 1), line === 0 ? 1400 : 3400);
    return () => window.clearTimeout(t);
  }, [line, playSfx]);

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      {/* giant aurora */}
      <div className="pointer-events-none absolute -top-1/4 left-1/2 h-[80vh] w-[150vw] -translate-x-1/2 rounded-full bg-violet/25 blur-[140px] animate-aurora" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[50vh] w-[50vh] rounded-full bg-rose/20 blur-[120px] animate-aurora" style={{ animationDelay: "-6s" }} />

      {/* the glowing heart */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-28 w-28 items-center justify-center rounded-full bg-rose/20 blur-2xl"
        >
          <Heart
            className="h-20 w-20 fill-rose text-rose"
            strokeWidth={1}
            style={{ filter: "drop-shadow(0 0 25px rgba(255,77,141,0.9))" }}
          />
        </motion.div>
        {/* orbiting sparkles */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            className="absolute text-lg"
            style={{
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: [0, Math.cos((i / 6) * Math.PI * 2) * 90],
              y: [0, Math.sin((i / 6) * Math.PI * 2) * 90],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          >
            ✨
          </motion.span>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="eyebrow mt-10"
      >
        {FINALE.eyebrow}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-4 font-display text-4xl text-soft sm:text-5xl"
      >
        {FINALE.heading}
      </motion.h2>

      {/* message lines */}
      <div className="mt-10 flex max-w-xl flex-col gap-6">
        <AnimatePresence mode="wait">
          {FINALE.lines.slice(0, line).map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg leading-relaxed text-soft/85 sm:text-xl"
            >
              {text}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      {/* grand heading + signature */}
      <AnimatePresence>
        {grand && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col items-center"
          >
            <motion.h3
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="font-display text-4xl font-bold text-gradient-rose text-shadow-glow sm:text-6xl"
            >
              {FINALE.grandHeading}
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 flex items-center gap-3"
            >
              <div className="h-px w-12 bg-champagne/50" />
              <Heart className="h-4 w-4 fill-champagne text-champagne" strokeWidth={1.5} />
              <div className="h-px w-12 bg-champagne/50" />
            </motion.div>
            <p className="mt-3 font-hand text-2xl text-champagne sm:text-3xl">
              {FINALE.signatureLine}
            </p>
            <p className="font-hand text-3xl text-champagne sm:text-4xl">{FINALE.signature}</p>

            {/* tiny celebratory cake */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-8 scale-75 sm:scale-90"
            >
              <BirthdayCake litCandles={[true, true, true]} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="mt-12"
            >
              <MagicButton onClick={onReplay} tone="rose">
                {FINALE.replay}
              </MagicButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
