"use client";

// ---------------------------------------------------------------------------
// BirthdayCake — a three-tier CSS cake: striped candles with swaying flames,
// dripping icing, gold trim, sugar pearls and roses. `litCandles` controls
// which flames burn, `celebrating` adds sparkle once the wish is made.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";

const PEARLS = [12, 26, 40, 54, 68, 82, 96];

export default function BirthdayCake({
  litCandles,
  celebrating,
}: {
  litCandles: boolean[];
  celebrating?: boolean;
}) {
  return (
    <div className="relative" style={{ perspective: "900px" }}>
      {/* warm pool of light under the cake */}
      <div className="animate-cake-glow absolute bottom-2 left-1/2 h-16 w-64 -translate-x-1/2 rounded-full bg-rose/30 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-6 w-72 -translate-x-1/2 rounded-full bg-black/50 blur-xl" />

      <div className="relative mx-auto h-[300px] w-[220px] sm:h-[352px] sm:w-[270px]">
        {/* ---------------- plate ---------------- */}
        <div className="absolute -bottom-1 left-1/2 h-4 w-[220px] -translate-x-1/2 rounded-full bg-gradient-to-b from-champagne/70 via-amber-200/40 to-transparent sm:w-[270px]" />
        <div className="absolute -bottom-2 left-1/2 h-3 w-[180px] -translate-x-1/2 rounded-full bg-black/40 blur-md sm:w-[220px]" />

        {/* ---------------- bottom tier ---------------- */}
        <div className="absolute bottom-1 left-1/2 h-[92px] w-[204px] -translate-x-1/2 overflow-hidden rounded-[18px] bg-gradient-to-b from-[#41265c] via-[#331c4c] to-[#231238] shadow-[0_28px_60px_-24px_rgba(0,0,0,0.95),inset_0_-18px_30px_-20px_rgba(0,0,0,0.9)] sm:h-[104px] sm:w-[252px]">
          {/* soft light spill from the candles */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-amber-200/25 to-transparent" />
          {/* sprinkles */}
          {[
            { l: 14, t: 58, c: "#ffd9a0", r: 24 },
            { l: 40, t: 74, c: "#ff8ac1", r: -18 },
            { l: 78, t: 62, c: "#c4b5fd", r: 42 },
            { l: 120, t: 78, c: "#ffd9a0", r: -32 },
            { l: 158, t: 60, c: "#ff8ac1", r: 12 },
            { l: 186, t: 76, c: "#c4b5fd", r: 64 },
          ].map((sp, i) => (
            <span
              key={i}
              className="absolute block h-[3px] w-[9px] rounded-full opacity-80"
              style={{
                left: sp.l,
                top: sp.t,
                background: sp.c,
                transform: `rotate(${sp.r}deg)`,
              }}
            />
          ))}
          {/* gold band */}
          <div className="absolute bottom-9 left-4 right-4 h-[6px] rounded-full bg-gradient-to-r from-champagne/40 via-amber-200 to-champagne/40 opacity-90" />
          {/* pearls */}
          <div className="absolute bottom-[52px] left-5 right-5 flex justify-between">
            {PEARLS.map((p) => (
              <span
                key={p}
                className="h-1.5 w-1.5 rounded-full bg-soft/80 shadow-[0_0_6px_rgba(255,247,251,0.7)]"
              />
            ))}
          </div>
          <Rose className="left-4 top-[26px]" size={24} />
          <Rose className="right-4 top-[26px]" size={24} />
        </div>

        {/* icing on the bottom tier — drips scale with the tier */}
        <div className="absolute bottom-[88px] left-1/2 w-[210px] -translate-x-1/2 sm:bottom-[100px] sm:w-[258px]">
          <div className="h-6 rounded-t-[14px] rounded-b-[10px] bg-gradient-to-b from-rose-50 via-rose-100 to-rose-200 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.6)]" />
          <div className="absolute -top-2 left-1 right-1 flex justify-between">
            {[16, 12, 20, 14, 18, 13, 17].map((h, i) => (
              <span
                key={i}
                className="rounded-b-full bg-gradient-to-b from-rose-100 to-rose-200 shadow-[0_3px_5px_-3px_rgba(0,0,0,0.7)]"
                style={{ width: 14 + (i % 3) * 4, height: h + 22 }}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 top-0 h-[2px] rounded-full bg-white/70" />
        </div>

        {/* ---------------- middle tier ---------------- */}
        <div className="absolute bottom-[104px] left-1/2 h-[74px] w-[158px] -translate-x-1/2 overflow-hidden rounded-[16px] bg-gradient-to-b from-[#4c2c69] via-[#3b2054] to-[#2a153f] shadow-[0_20px_46px_-22px_rgba(0,0,0,0.95),inset_0_-14px_26px_-18px_rgba(0,0,0,0.9)] sm:bottom-[120px] sm:w-[196px]">
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-amber-200/20 to-transparent" />
          <div className="absolute bottom-7 left-3 right-3 h-[5px] rounded-full bg-gradient-to-r from-champagne/40 via-amber-200 to-champagne/40 opacity-90" />
          <Rose className="left-3 top-[22px]" size={20} />
          <Rose className="right-3 top-[22px]" size={20} />
        </div>

        {/* icing on the middle tier */}
        <div className="absolute bottom-[172px] left-1/2 w-[164px] -translate-x-1/2 sm:bottom-[188px] sm:w-[202px]">
          <div className="h-5 rounded-t-[12px] rounded-b-[9px] bg-gradient-to-b from-fuchsia-50 via-fuchsia-100 to-fuchsia-200 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.6)]" />
          <div className="absolute -top-2 left-1 right-1 flex justify-between">
            {[14, 10, 17, 12, 15, 11].map((h, i) => (
              <span
                key={i}
                className="rounded-b-full bg-gradient-to-b from-fuchsia-100 to-fuchsia-200 shadow-[0_3px_5px_-3px_rgba(0,0,0,0.7)]"
                style={{ width: 12 + (i % 3) * 4, height: h + 18 }}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 top-0 h-[2px] rounded-full bg-white/70" />
        </div>

        {/* ---------------- top tier ---------------- */}
        <div className="absolute bottom-[188px] left-1/2 h-[58px] w-[118px] -translate-x-1/2 overflow-hidden rounded-[14px] bg-gradient-to-b from-[#5c3583] via-[#452763] to-[#311a4a] shadow-[0_16px_38px_-18px_rgba(0,0,0,0.95),inset_0_-12px_22px_-16px_rgba(0,0,0,0.9)] sm:bottom-[208px] sm:w-[146px]">
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-amber-200/22 to-transparent" />
          <div className="absolute bottom-5 left-3 right-3 h-[5px] rounded-full bg-gradient-to-r from-champagne/40 via-amber-200 to-champagne/40 opacity-90" />
        </div>

        {/* icing on the top tier */}
        <div className="absolute bottom-[240px] left-1/2 w-[124px] -translate-x-1/2 sm:bottom-[260px] sm:w-[152px]">
          <div className="h-4 rounded-t-[10px] rounded-b-[8px] bg-gradient-to-b from-violet-50 via-violet-100 to-violet-200 shadow-[0_5px_12px_-5px_rgba(0,0,0,0.6)]" />
          <div className="absolute -top-1.5 left-1 right-1 flex justify-between">
            {[12, 9, 14, 10, 13].map((h, i) => (
              <span
                key={i}
                className="rounded-b-full bg-gradient-to-b from-violet-100 to-violet-200 shadow-[0_3px_5px_-3px_rgba(0,0,0,0.7)]"
                style={{ width: 11 + (i % 2) * 3, height: h + 14 }}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 top-0 h-[2px] rounded-full bg-white/70" />
        </div>

        {/* ---------------- candles ---------------- */}
        <div className="absolute bottom-[248px] left-1/2 flex w-[128px] -translate-x-1/2 items-end justify-between sm:bottom-[268px] sm:w-[156px]">
          {litCandles.map((lit, i) => (
            <Candle key={i} lit={lit} index={i} />
          ))}
        </div>

        {/* sparkle when the wish is made */}
        <AnimatePresence>
          {celebrating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute -top-2 left-1/2 h-24 w-48 -translate-x-1/2"
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 text-xl"
                  style={{ top: `${i * 9}px`, x: `${(i - 2.5) * 18}px` }}
                  animate={{ y: [0, -34, 0], opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.2, delay: i * 0.16, repeat: Infinity, ease: "easeOut" }}
                >
                  {i % 2 ? "✨" : "💫"}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Candle({ lit, index }: { lit: boolean; index: number }) {
  // a little height variation keeps the row from feeling machine-made
  const bodyHeight = [40, 46, 38, 48, 42][index % 5];

  return (
    <div className="relative flex w-[18px] flex-col items-center sm:w-[22px]">
      {/* flame + glow */}
      <AnimatePresence>
        {lit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3, y: -4 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: bodyHeight + 4 }}
          >
            {/* halo */}
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/35 blur-xl" />
            <div className="absolute left-1/2 top-2 h-10 w-10 -translate-x-1/2 rounded-full bg-orange-400/25 blur-lg" />
            {/* flame body */}
            <div
              className="animate-flame relative h-[34px] w-[13px] origin-bottom"
              style={{ animationDelay: `${index * -0.37}s` }}
            >
              <svg viewBox="0 0 20 40" className="h-full w-full overflow-visible">
                <defs>
                  <radialGradient id={`flameCore-${index}`} cx="50%" cy="70%" r="60%">
                    <stop offset="0%" stopColor="#fffdf0" />
                    <stop offset="45%" stopColor="#ffe9a8" />
                    <stop offset="100%" stopColor="#ffb347" />
                  </radialGradient>
                  <linearGradient id={`flameOuter-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffb347" stopOpacity="0.95" />
                    <stop offset="55%" stopColor="#ff7b54" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#ff4d8d" stopOpacity="0.35" />
                  </linearGradient>
                </defs>
                {/* outer teardrop */}
                <path
                  d="M10 1c0 0-7 9.4-7 18.6A7 7 0 0 0 17 19.6C17 10.4 10 1 10 1z"
                  fill={`url(#flameOuter-${index})`}
                />
                {/* inner core */}
                <ellipse cx="10" cy="24" rx="3.4" ry="6.2" fill={`url(#flameCore-${index})`} />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* smoke after blowing */}
      <AnimatePresence>
        {!lit && (
          <div
            className="smoke-wisp absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-soft/40 blur-[3px]"
            style={{ bottom: bodyHeight + 6 }}
          />
        )}
      </AnimatePresence>

      {/* wick */}
      <div className="h-[5px] w-[2px] rounded-full bg-[#2b1b3a]" />

      {/* candle body — striped, with a lit top edge */}
      <div
        className="relative w-[9px] overflow-hidden rounded-t-[3px] rounded-b-[2px] shadow-[inset_-2px_0_3px_rgba(0,0,0,0.35)] sm:w-[10px]"
        style={{
          height: bodyHeight,
          backgroundImage:
            "repeating-linear-gradient(-45deg, #fff7fb 0 4px, #ff8ac1 4px 8px)",
        }}
      >
        <span className="absolute inset-y-0 left-0 w-[3px] bg-white/45" />
        <span className="absolute inset-x-0 top-0 h-[3px] bg-champagne/80" />
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
