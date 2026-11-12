"use client";

// ---------------------------------------------------------------------------
// MagicButton — the signature glowing pill button of the experience.
// ---------------------------------------------------------------------------

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Tone = "rose" | "gold" | "ghost";

const TONES: Record<Tone, string> = {
  rose:
    "bg-gradient-to-r from-rose via-fuchsia-400 to-violet text-white shadow-[0_10px_40px_-10px_rgba(255,77,141,0.8)]",
  gold:
    "bg-gradient-to-r from-champagne via-rose-200 to-champagne text-plum shadow-[0_10px_40px_-10px_rgba(255,217,160,0.7)]",
  ghost:
    "glass text-soft hover:border-rose/50",
};

export default function MagicButton({
  children,
  onClick,
  tone = "rose",
  disabled = false,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: Tone;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.04, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`relative inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg ${TONES[tone]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* shimmer sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span className="shimmer-border animate-shimmer absolute inset-0 rounded-full" />
      </span>
    </motion.button>
  );
}
