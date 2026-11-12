"use client";

// ---------------------------------------------------------------------------
// JourneyNav — discreet floating progress indicator.
// Shows the birthday journey progress, previous/next/replay, and
// music + sound-effect toggles. No conventional navbar anywhere.
// ---------------------------------------------------------------------------

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Headphones, VolumeX, Volume2, RotateCcw } from "lucide-react";
import { useAudio } from "@/components/AudioProvider";
import { SCREEN_TITLES } from "@/lib/content";

export default function JourneyNav({
  screen,
  total,
  onPrev,
  onNext,
  onJump,
  onReplay,
}: {
  screen: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: (index: number) => void;
  onReplay: () => void;
}) {
  const { musicOn, sfxOn, toggleMusic, toggleSfx } = useAudio();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed bottom-4 left-1/2 z-40 flex w-[94vw] max-w-md items-center gap-2 rounded-2xl border border-soft/10 bg-plum/70 p-2 backdrop-blur-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.9)] sm:bottom-6"
    >
      {/* prev */}
      <NavButton onClick={onPrev} disabled={screen === 0} ariaLabel="Previous screen">
        <ChevronLeft className="h-5 w-5" />
      </NavButton>

      {/* progress dots */}
      <div className="flex flex-1 items-center justify-center gap-1.5">
        {SCREEN_TITLES.map((title, i) => (
          <button
            key={i}
            type="button"
            onClick={() => i !== screen && onJump(i)}
            aria-label={`Go to ${title}`}
            title={title}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === screen
                ? "w-7 bg-gradient-to-r from-rose to-violet"
                : i < screen
                ? "w-2 bg-champagne/60"
                : "w-2 bg-soft/20"
            }`}
          />
        ))}
      </div>

      {/* next */}
      <NavButton onClick={onNext} disabled={screen === total - 1} ariaLabel="Next screen">
        <ChevronRight className="h-5 w-5" />
      </NavButton>

      {/* replay */}
      <NavButton onClick={onReplay} ariaLabel="Replay experience">
        <RotateCcw className="h-4 w-4" />
      </NavButton>

      {/* music */}
      <NavButton onClick={toggleMusic} ariaLabel={musicOn ? "Pause music" : "Play music"}>
        {musicOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </NavButton>

      {/* sound effects */}
      <NavButton onClick={toggleSfx} ariaLabel={sfxOn ? "Disable sound effects" : "Enable sound effects"}>
        {sfxOn ? <Headphones className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </NavButton>
    </motion.div>
  );
}

function NavButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.12 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      aria-label={ariaLabel}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-soft/70 transition hover:bg-soft/10 hover:text-soft disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </motion.button>
  );
}
