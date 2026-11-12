"use client";

// ---------------------------------------------------------------------------
// BirthdayCake — a three-layer CSS cake with frosting, roses, gold details
// and glowing candles. `litCandles` controls which flames burn.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";

export default function BirthdayCake({
  litCandles,
  celebrating,
}: {
  litCandles: boolean[];
  celebrating?: boolean;
}) {
  return (
    <div className="relative" style={{ perspective: "900px" }}>
      {/* glow under the cake */}
      <div className="absolute left-1/2 top-[58%] h-16 w-72 -translate-x-1/2 rounded-full bg-rose/30 blur-3xl" />

      <div className="relative mx-auto h-[230px] w-[210px] sm:h-[280px] sm:w-[260px]">
        {/* ---------- bottom layer ---------- */}
        <div className="absolute bottom-0 left-1/2 h-[88px] w-[200px] -translate-x-1/2 rounded-2xl bg-gradient-to-b from-[#3d2357] to-[#2a1540] shadow-[0_25px_60px_-20px_rgba(0,0,0,0.9)] sm:w-[250px]">
          {/* frosting top */}
          <div className="absolute -top-3 left-0 right-0 h-10 rounded-b-[2rem] bg-gradient-to-b from-rose-100 to-rose-200" />
          {/* drips */}
          {[10, 34, 58, 82, 106, 130, 154, 178].map((left, i) => (
            <div
              key={i}
              className="absolute -top-3 rounded-b-full bg-gradient-to-b from-rose-100 to-rose-200"
              style={{ left: `${left}px`, width: `${14 + (i % 3) * 6}px`, height: `${18 + (i % 2) * 12}px` }}
            />
          ))}
          {/* gold band */}
          <div className="absolute bottom-8 left-4 right-4 h-2 rounded-full bg-gradient-to-r from-champagne via-amber-200 to-champagne opacity-80" />
          {/* roses */}
          <Rose className="left-6 top-10" size={26} />
          <Rose className="right-6 top-10" size={26} />
        </div>

        {/* ---------- middle layer ---------- */}
        <div className="absolute bottom-[76px] left-1/2 h-[76px] w-[160px] -translate-x-1/2 rounded-2xl bg-gradient-to-b from-[#4a2a68] to-[#321c4e] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] sm:w-[200px]">
          <div className="absolute -top-3 left-0 right-0 h-9 rounded-b-[2rem] bg-gradient-to-b from-fuchsia-100 to-fuchsia-200" />
          {[14, 38, 62, 86, 110, 134].map((left, i) => (
            <div
              key={i}
              className="absolute -top-3 rounded-b-full bg-gradient-to-b from-fuchsia-100 to-fuchsia-200"
              style={{ left: `${left}px`, width: `${12 + (i % 3) * 5}px`, height: `${14 + (i % 2) * 10}px` }}
            />
          ))}
          <div className="absolute bottom-7 left-4 right-4 h-2 rounded-full bg-gradient-to-r from-champagne via-amber-200 to-champagne opacity-80" />
          <Rose className="left-5 top-8" size={22} />
          <Rose className="right-5 top-8" size={22} />
        </div>

        {/* ---------- top layer ---------- */}
        <div className="absolute bottom-[138px] left-1/2 h-[64px] w-[120px] -translate-x-1/2 rounded-2xl bg-gradient-to-b from-[#5b3480] to-[#3e2358] shadow-[0_18px_45px_-18px_rgba(0,0,0,0.9)] sm:bottom-[160px] sm:w-[150px]">
          <div className="absolute -top-3 left-0 right-0 h-8 rounded-b-[2rem] bg-gradient-to-b from-violet-100 to-violet-200" />
          {[12, 36, 60, 84, 108].map((left, i) => (
            <div
              key={i}
              className="absolute -top-3 rounded-b-full bg-gradient-to-b from-violet-100 to-violet-200"
              style={{ left: `${left}px`, width: `${10 + (i % 3) * 5}px`, height: `${12 + (i % 2) * 8}px` }}
            />
          ))}
          <div className="absolute bottom-6 left-3 right-3 h-2 rounded-full bg-gradient-to-r from-champagne via-amber-200 to-champagne opacity-80" />
          {/* top rose */}
          <Rose className="left-1/2 top-4" size={24} />
        </div>

        {/* ---------- candles ---------- */}
        <div className="absolute bottom-[176px] left-1/2 flex w-[120px] -translate-x-1/2 items-end justify-between sm:bottom-[212px] sm:w-[150px]">
          {litCandles.map((lit, i) => (
            <div key={i} className="flex w-5 flex-col items-center sm:w-6">
              <AnimatePresence>
                {lit && (
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.2, opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="flame absolute -bottom-[38px]"
                  >
                    {/* flame glow */}
                    <div className="absolute left-1/2 top-1 h-10 w-10 -translate-x-1/2 rounded-full bg-amber-300/40 blur-2xl" />
                    <svg viewBox="0 0 24 36" className="relative h-[38px] w-5">
                      <path
                        d="M12 0C12 0 4 9 4 18a8 8 0 0 0 16 0C20 9 12 0 12 0z"
                        fill="url(#flameGrad)"
                      />
                      <defs>
                        <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fff7c2" />
                          <stop offset="45%" stopColor="#ffd166" />
                          <stop offset="100%" stopColor="#ff7b54" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="h-10 w-full rounded-t-sm bg-gradient-to-b from-champagne/90 to-rose-300/70" />
              <div className="h-1.5 w-full rounded-b-sm bg-rose-400/60" />
            </div>
          ))}
        </div>

        {/* candle plate sparkle when celebrating */}
        <AnimatePresence>
          {celebrating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-10 left-1/2 h-20 w-40 -translate-x-1/2"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 text-2xl"
                  style={{ top: `${i * 8}px`, x: `${(i - 2) * 16}px` }}
                  animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.6, delay: i * 0.12, repeat: Infinity, ease: "easeOut" }}
                >
                  ✨
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Rose({ className, size = 24 }: { className: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`absolute ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="9" fill="#ff4d8d" />
      <path
        d="M24 15c5 0 9 4 9 9 0 4-3 6-6 7-2-1-3-3-3-5-2 1-4 3-4 6 0 4 4 6 9 5"
        fill="#ff8ac1"
        opacity="0.9"
      />
      <path
        d="M24 15c-5 0-9 4-9 9 0 4 3 6 6 7 2-1 3-3 3-5 2 1 4 3 4 6 0 4-4 6-9 5"
        fill="#ffb3d1"
        opacity="0.8"
      />
      <circle cx="24" cy="24" r="4" fill="#e63e7a" />
      <circle cx="22" cy="22" r="1.4" fill="#ffd9a0" opacity="0.8" />
    </svg>
  );
}
