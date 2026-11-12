"use client";

// ---------------------------------------------------------------------------
// SCREEN 03 — A LETTER FROM MY HEART
// Midnight stationery with an animated handwritten letter (Caveat),
// gold divider, glowing edges, paper grain and floating tiny hearts.
// ---------------------------------------------------------------------------

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
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
    }, revealed === 0 ? 700 : 2600);
    return () => window.clearTimeout(t);
  }, [revealed, playSfx]);

  const signatureRevealed = revealed >= LETTER.paragraphs.length;

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-4xl text-soft sm:text-5xl"
      >
        {LETTER.heading}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-10 w-full max-w-xl"
      >
        {/* stationery card */}
        <div className="paper-grain relative overflow-hidden rounded-3xl border border-champagne/30 bg-gradient-to-br from-[#1c1230] to-[#140c24] p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-10">
          {/* glowing edges */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_-20px_rgba(255,77,141,0.25)]" />
          {/* floating tiny hearts */}
          <span aria-hidden="true" className="pointer-events-none absolute right-6 top-6 animate-float text-rose/60">💗</span>
          <span aria-hidden="true" className="pointer-events-none absolute left-8 top-1/2 animate-float-slow text-violet/50" style={{ animationDelay: "-3s" }}>✨</span>

          <div className="relative">
            {LETTER.paragraphs.slice(0, revealed).map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-hand text-2xl leading-relaxed text-soft/90 sm:text-3xl"
              >
                {para}
              </motion.p>
            ))}

            {/* gold divider + signature */}
            <SignatureBlock visible={signatureRevealed} name={LETTER.signature} />
          </div>

          {/* gold corner flourishes */}
          <svg viewBox="0 0 40 40" className="absolute -left-2 -top-2 h-12 w-12 text-champagne/40" aria-hidden="true">
            <path d="M2 38V20C2 20 6 18 12 16C18 14 20 10 20 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <svg viewBox="0 0 40 40" className="absolute -bottom-2 -right-2 h-12 w-12 text-champagne/40 rotate-180" aria-hidden="true">
            <path d="M2 38V20C2 20 6 18 12 16C18 14 20 10 20 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: signatureRevealed ? 1 : 0.35, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-12"
      >
        <MagicButton onClick={onContinue} disabled={!signatureRevealed} tone="gold">
          {LETTER.continue}
        </MagicButton>
      </motion.div>
    </section>
  );
}

function SignatureBlock({ visible, name }: { visible: boolean; name: string }) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15 }}
      className="mt-8"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-champagne/60" />
        <Heart className="h-4 w-4 fill-rose text-rose" strokeWidth={1.5} />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-champagne/60" />
      </div>
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.7 }}
        className="font-hand text-3xl text-champagne sm:text-4xl"
      >
        {name}
      </motion.p>
    </motion.div>
  );
}
