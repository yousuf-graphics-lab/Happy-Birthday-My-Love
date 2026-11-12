"use client";

// ---------------------------------------------------------------------------
// SCREEN 01 — THE MAGICAL WELCOME
// A floating midnight envelope with a rose-and-violet wax seal.
// Clicking opens it: seal breaks, letter slides out, golden particles burst,
// music begins, and the experience transitions to the birthday reveal.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useAudio } from "@/components/AudioProvider";
import MagicButton from "@/components/ui/MagicButton";
import { WELCOME } from "@/lib/content";
import { goldenBurst } from "@/lib/confetti";

type Phase = "closed" | "opening" | "opened";

export default function Screen01Welcome({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const { startMusic, playSfx } = useAudio();
  const [phase, setPhase] = useState<Phase>("closed");

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    playSfx("envelope");
    // Sequence: seal breaks → letter slides out → golden burst → music → advance
    window.setTimeout(() => {
      goldenBurst(0.5, 0.42);
      playSfx("sparkle");
    }, 520);
    window.setTimeout(() => {
      startMusic();
    }, 900);
    window.setTimeout(() => {
      setPhase("opened");
    }, 1400);
    window.setTimeout(() => {
      onContinue();
    }, 3000);
  };

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5 py-24 text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="eyebrow"
      >
        {WELCOME.eyebrow}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.45 }}
        className="mt-5 font-display text-5xl leading-tight text-soft text-shadow-glow sm:text-6xl"
      >
        {WELCOME.heading}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.7 }}
        className="mt-5 max-w-md text-base leading-relaxed text-soft/70 sm:text-lg"
      >
        {WELCOME.supporting}
      </motion.p>

      {/* The envelope */}
      <div className="relative mt-12 flex h-72 w-52 items-center justify-center sm:h-80 sm:w-60">
        {/* glow halo */}
        <div className="absolute h-40 w-44 rounded-full bg-rose/20 blur-3xl sm:h-48 sm:w-52" />

        <AnimatePresence>
          {phase !== "opened" && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, y: 30, rotate: -4 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: 0,
                ...(phase === "opening"
                  ? { rotate: -26, y: -8, opacity: 0.4 }
                  : {}),
              }}
              exit={{ opacity: 0, y: -40, rotate: -26 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-64 w-48 animate-float sm:h-72 sm:w-56"
            >
              {/* envelope body */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-plum to-midnight shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)]" />
              {/* flap */}
              <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-xl bg-gradient-to-br from-[#241540] to-plum">
                <svg viewBox="0 0 240 150" className="h-full w-full">
                  <path d="M0 0L240 0L120 150Z" fill="rgba(255,247,251,0.06)" />
                  <path d="M0 0L240 0L120 150Z" fill="none" stroke="rgba(255,217,160,0.35)" strokeWidth="1.5" />
                </svg>
              </div>
              {/* wax seal */}
              <motion.div
                initial={{ scale: 1, rotate: 0, opacity: 1 }}
                animate={
                  phase === "opening"
                    ? { scale: 0.2, rotate: 40, opacity: 0 }
                    : { scale: 1, rotate: 0, opacity: 1 }
                }
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="absolute left-1/2 top-[42%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-rose to-violet shadow-[0_0_30px_rgba(255,77,141,0.7)] ring-1 ring-champagne/40"
              >
                <Heart className="h-7 w-7 fill-white text-white" strokeWidth={1.5} />
              </motion.div>
              {/* gold trim */}
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-champagne/25" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* the letter sliding out */}
        <AnimatePresence>
          {phase === "opened" && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="absolute h-32 w-40 rounded-lg bg-gradient-to-br from-soft to-champagne/70 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
                <Heart className="h-6 w-6 fill-rose text-rose" strokeWidth={1.5} />
                <p className="mt-2 font-hand text-2xl text-plum">For my Samiya</p>
                <p className="font-hand text-lg text-plum/70">happy birthday 💕</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-12"
      >
        <MagicButton onClick={handleOpen} disabled={phase !== "closed"}>
          {phase === "closed" ? WELCOME.button : phase === "opening" ? "Unwrapping…" : "Taking you inside…"}
        </MagicButton>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.6 }}
        className="mt-6 text-sm tracking-widest text-soft/50"
      >
        made with love, just for you
      </motion.p>
    </section>
  );
}
