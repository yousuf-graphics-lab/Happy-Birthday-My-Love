"use client";

// ---------------------------------------------------------------------------
// GlassCard — translucent, blurred, glowing-bordered surface.
// ---------------------------------------------------------------------------

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "default" | "strong" | "gold";

const VARIANTS: Record<Variant, string> = {
  default: "glass",
  strong: "glass-strong",
  gold: "glass-gold",
};

export default function GlassCard({
  children,
  variant = "default",
  className = "",
  glow = false,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  glow?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`relative rounded-3xl ${VARIANTS[variant]} ${glow ? "shadow-[0_0_50px_-12px_rgba(255,77,141,0.5)]" : "shadow-[0_20px_60px_-25px_rgba(0,0,0,0.8)]"} ${className}`}
    >
      {children}
    </motion.div>
  );
}
