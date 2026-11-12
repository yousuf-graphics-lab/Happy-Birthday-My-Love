"use client";

// ---------------------------------------------------------------------------
// SCREEN 04 — A BOUQUET FOR HER
// An empty bouquet appears first: wrapped paper, ribbon and stems. Then the
// flowers bloom into it one by one — roses, lilies and gold blossoms — while
// the poem waits underneath. "Accept These Flowers?" showers the screen with
// rose petals.
// ---------------------------------------------------------------------------

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import MagicButton from "@/components/ui/MagicButton";
import { useAudio } from "@/components/AudioProvider";
import { BOUQUET } from "@/lib/content";
import { rosePetalShower } from "@/lib/confetti";

type FlowerKind = "rose-red" | "rose-blush" | "lily" | "gold" | "peony";

// Each bloom carries its own place in the arrangement, size and bloom order.
const BLOOMS: {
  kind: FlowerKind;
  left: string;
  top: string;
  size: number;
  rotate: number;
  delay: number;
}[] = [
  { kind: "lily", left: "46%", top: "0%", size: 92, rotate: -4, delay: 1.5 },
  { kind: "rose-red", left: "18%", top: "10%", size: 88, rotate: 8, delay: 1.9 },
  { kind: "rose-blush", left: "70%", top: "9%", size: 86, rotate: -10, delay: 2.3 },
  { kind: "gold", left: "0%", top: "30%", size: 74, rotate: 14, delay: 2.7 },
  { kind: "peony", left: "82%", top: "31%", size: 78, rotate: -8, delay: 3.1 },
  { kind: "rose-red", left: "33%", top: "30%", size: 68, rotate: -6, delay: 3.5 },
  { kind: "gold", left: "57%", top: "34%", size: 62, rotate: 10, delay: 3.9 },
];

export default function Screen04Bouquet({ onContinue }: { onContinue: () => void }) {
  const { playSfx } = useAudio();
  const [accepted, setAccepted] = useState(false);

  const accept = () => {
    if (accepted) {
      onContinue();
      return;
    }
    setAccepted(true);
    playSfx("bloom");
    rosePetalShower();
    window.setTimeout(() => playSfx("sparkle"), 500);
  };

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5 pb-24 pt-20 text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="eyebrow"
      >
        {BOUQUET.eyebrow}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-4 max-w-xl font-display text-3xl leading-snug text-soft sm:text-4xl"
      >
        {BOUQUET.heading}
      </motion.h2>

      {/* ----------------------------- the bouquet ----------------------------- */}
      <div className="relative mt-6 h-[380px] w-[320px] sm:h-[430px] sm:w-[368px]">
        {/* light behind the flowers */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.25, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-rose/25 blur-[70px]"
        />

        {/* stems, drawn first */}
        <motion.svg
          viewBox="0 0 320 380"
          className="absolute inset-0 h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="stem" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5f9e79" />
              <stop offset="100%" stopColor="#2f6b4d" />
            </linearGradient>
          </defs>
          {[
            "M160 210 C158 170 154 120 150 74",
            "M160 210 C150 175 130 130 96 96",
            "M160 210 C172 168 200 130 238 98",
            "M160 210 C146 190 120 178 66 156",
            "M160 210 C176 190 214 182 268 158",
            "M160 210 C158 196 146 176 128 148",
            "M160 210 C164 196 178 180 196 152",
          ].map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="url(#stem)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 0.8 + i * 0.08, ease: "easeOut" }}
            />
          ))}
          {/* leaves */}
          {[
            { x: 112, y: 150, r: -38 },
            { x: 214, y: 156, r: 34 },
            { x: 140, y: 108, r: -22 },
            { x: 186, y: 116, r: 20 },
          ].map((leaf, i) => (
            <motion.ellipse
              key={i}
              cx={leaf.x}
              cy={leaf.y}
              rx="13"
              ry="27"
              fill="#4f8f6b"
              opacity="0.85"
              transform={`rotate(${leaf.r} ${leaf.x} ${leaf.y})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.85 }}
              transition={{ duration: 0.7, delay: 1.1 + i * 0.12 }}
            />
          ))}
        </motion.svg>

        {/* wrapped paper — the bouquet arrives first, empty */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[210px]"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 320 210" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="wrap" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b2358" />
                <stop offset="52%" stopColor="#2c1a45" />
                <stop offset="100%" stopColor="#221334" />
              </linearGradient>
              <linearGradient id="wrapLight" x1="0" y1="0" x2="1" y2="0.6">
                <stop offset="0%" stopColor="#4d2f6d" />
                <stop offset="100%" stopColor="#2a1842" />
              </linearGradient>
            </defs>
            {/* cone */}
            <path
              d="M34 10 L286 10 L212 176 Q160 200 108 176 Z"
              fill="url(#wrap)"
              stroke="rgba(255,217,160,0.35)"
              strokeWidth="1.4"
            />
            {/* paper folds */}
            <path d="M34 10 L160 118 L108 176 Q160 200 212 176 L160 118 L286 10" fill="none" stroke="rgba(255,217,160,0.16)" strokeWidth="1" />
            <path d="M160 118 L160 186" stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
            <path d="M34 10 L120 96 L160 118" fill="url(#wrapLight)" opacity="0.45" />
            <path d="M286 10 L200 96 L160 118" fill="url(#wrapLight)" opacity="0.3" />
            {/* ribbon band */}
            <path d="M78 74 Q160 108 242 74 L236 96 Q160 128 84 96 Z" fill="#d94a86" opacity="0.9" />
            <path d="M78 74 Q160 108 242 74" fill="none" stroke="#ffb3d1" strokeWidth="1.4" opacity="0.8" />
            {/* bow */}
            <g transform="translate(160 96)">
              <path d="M0 0 C-22 -16 -48 -10 -46 6 C-44 20 -18 20 0 4 Z" fill="#ff6fa3" />
              <path d="M0 0 C22 -16 48 -10 46 6 C44 20 18 20 0 4 Z" fill="#ff8ac1" />
              <circle cx="0" cy="3" r="8" fill="#e33f7b" />
              <path d="M-4 8 C-14 26 -20 34 -30 44" stroke="#ff6fa3" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M4 8 C12 26 18 36 28 46" stroke="#ff8ac1" strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </motion.div>

        {/* the flowers, blooming one by one */}
        <div className="absolute inset-x-0 top-0 h-[230px] sm:h-[250px]">
          {BLOOMS.map((bloom, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: bloom.left,
                top: bloom.top,
                width: bloom.size,
                height: bloom.size,
              }}
              initial={{ scale: 0, opacity: 0, rotate: bloom.rotate - 24 }}
              animate={{ scale: 1, opacity: 1, rotate: bloom.rotate }}
              transition={{
                delay: bloom.delay,
                type: "spring",
                stiffness: 120,
                damping: 13,
              }}
            >
              <Flower kind={bloom.kind} index={i} />
            </motion.div>
          ))}
        </div>

        {/* butterflies */}
        {[
          { left: "8%", top: "22%", delay: 0, dur: 11 },
          { left: "84%", top: "40%", delay: 3, dur: 13 },
        ].map((b, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute text-xl opacity-80"
            style={{ left: b.left, top: b.top }}
            animate={{ x: [0, 26, -18, 12, 0], y: [0, -16, 10, -8, 0], rotate: [0, 6, -5, 3, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
            aria-hidden="true"
          >
            🦋
          </motion.div>
        ))}
      </div>

      {/* the poem */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.3, duration: 1 }}
        className="mt-6 w-full max-w-lg"
      >
        <GlassCard variant="strong" className="p-7 sm:p-9">
          <div className="mx-auto mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rose/50" />
            <Heart className="h-4 w-4 fill-rose text-rose" strokeWidth={1.5} />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rose/50" />
          </div>
          <div className="space-y-3">
            {BOUQUET.poem.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4.5 + i * 0.12, duration: 0.6 }}
                className="font-display text-lg leading-relaxed text-soft/90 sm:text-xl"
              >
                {line}
              </motion.p>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.5 + BOUQUET.poem.length * 0.12 + 0.2 }}
            className="mt-6 text-right font-hand text-2xl text-champagne"
          >
            {BOUQUET.signature}
          </motion.p>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5.4 }}
        className="mt-12"
      >
        <MagicButton onClick={accept} tone={accepted ? "gold" : "rose"}>
          {accepted ? BOUQUET.accepted : BOUQUET.button}
        </MagicButton>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  flowers                                   */
/* -------------------------------------------------------------------------- */

function Flower({ kind, index }: { kind: FlowerKind; index: number }) {
  if (kind === "lily") return <Lily index={index} />;
  if (kind === "gold") return <GoldBloom index={index} />;
  if (kind === "peony") return <Peony index={index} />;
  return <Rose index={index} blush={kind === "rose-blush"} />;
}

function Rose({ index, blush }: { index: number; blush?: boolean }) {
  const outer = blush ? "#ffc4da" : "#ff7aa8";
  const mid = blush ? "#ffd9e6" : "#ff9dc0";
  const inner = blush ? "#ff8fbc" : "#e33f7b";
  const core = blush ? "#e8558f" : "#b8235c";
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_6px_14px_rgba(255,77,141,0.35)]" aria-hidden="true">
      <defs>
        <radialGradient id={`roseG-${index}`} cx="40%" cy="32%" r="70%">
          <stop offset="0%" stopColor={mid} />
          <stop offset="100%" stopColor={outer} />
        </radialGradient>
      </defs>
      {/* outer petals */}
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="50"
          cy="26"
          rx="19"
          ry="24"
          fill={outer}
          opacity="0.95"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {/* mid petals */}
      {[36, 108, 180, 252, 324].map((deg) => (
        <ellipse
          key={deg}
          cx="50"
          cy="34"
          rx="15"
          ry="19"
          fill={`url(#roseG-${index})`}
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {/* inner spiral */}
      <circle cx="50" cy="50" r="17" fill={inner} />
      <path
        d="M50 38c6 0 11 5 11 11s-5 10-11 10-9-4-9-9 4-8 8-8"
        fill="none"
        stroke={core}
        strokeWidth="3.4"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="50" cy="50" r="4.5" fill={core} />
      <circle cx="44" cy="43" r="2.2" fill="#fff7fb" opacity="0.65" />
    </svg>
  );
}

function Peony({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_6px_14px_rgba(255,140,180,0.35)]" aria-hidden="true">
      <defs>
        <radialGradient id={`peonyG-${index}`} cx="42%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#ffe1ec" />
          <stop offset="100%" stopColor="#ffa3c6" />
        </radialGradient>
      </defs>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <ellipse
          key={deg}
          cx="50"
          cy={i % 2 ? "30" : "26"}
          rx={i % 2 ? "15" : "18"}
          ry={i % 2 ? "20" : "23"}
          fill={`url(#peonyG-${index})`}
          opacity={i % 2 ? 0.85 : 0.95}
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {[22, 90, 158, 226, 294].map((deg) => (
        <ellipse key={deg} cx="50" cy="36" rx="11" ry="15" fill="#ffd0e1" transform={`rotate(${deg} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="12" fill="#ff8fbc" />
      <circle cx="50" cy="50" r="5" fill="#ffd9a0" opacity="0.9" />
    </svg>
  );
}

function Lily({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_6px_16px_rgba(255,247,251,0.35)]" aria-hidden="true">
      <defs>
        <linearGradient id={`lilyG-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff7fb" />
          <stop offset="100%" stopColor="#ffe3c9" />
        </linearGradient>
      </defs>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <path
          key={deg}
          d="M50 50 C40 34 42 16 50 8 C58 16 60 34 50 50 Z"
          fill={`url(#lilyG-${index})`}
          opacity="0.95"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {[30, 90, 150, 210, 270, 330].map((deg) => (
        <path
          key={deg}
          d="M50 50 C45 40 46 30 50 24 C54 30 55 40 50 50 Z"
          fill="#ffd9a0"
          opacity="0.55"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="8" fill="#ffcf7a" />
      {/* stamens */}
      {[20, 80, 140, 200, 260, 320].map((deg) => (
        <line
          key={deg}
          x1="50"
          y1="50"
          x2="50"
          y2="40"
          stroke="#e8a33d"
          strokeWidth="1.6"
          strokeLinecap="round"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="3.4" fill="#a9601c" />
    </svg>
  );
}

function GoldBloom({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_6px_16px_rgba(255,217,160,0.4)]" aria-hidden="true">
      <defs>
        <radialGradient id={`goldG-${index}`} cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff2cf" />
          <stop offset="55%" stopColor="#ffd9a0" />
          <stop offset="100%" stopColor="#f0b45f" />
        </radialGradient>
      </defs>
      {Array.from({ length: 10 }).map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="24"
          rx="10"
          ry="20"
          fill={`url(#goldG-${index})`}
          opacity="0.95"
          transform={`rotate(${i * 36} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="16" fill="#ffe9b8" />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle
          key={i}
          cx="50"
          cy="40"
          r="2.2"
          fill="#c98a34"
          opacity="0.85"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="4" fill="#b8762a" />
    </svg>
  );
}
