"use client";

// ---------------------------------------------------------------------------
// JourneyNav — a whisper of navigation. Tiny, transparent, pinned to the top
// edge: previous/next, progress dots, replay and the audio toggles.
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
      className="fixed left-1/2 top-3 z-40 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-soft/10 bg-plum/25 px-1.5 py-1 opacity-55 backdrop-blur-md transition-opacity duration-300 hover:opacity-100 focus-within:opacity-100 sm:top-4"
    >
      {/* prev */}
      <NavButton onClick={onPrev} disabled={screen === 0} ariaLabel="Previous screen">
        <ChevronLeft className="h-3.5 w-3.5" />
      </NavButton>

      {/* progress dots */}
      <div className="flex items-center justify-center gap-1 px-1">
        {SCREEN_TITLES.map((title, i) => (
          <button
            key={i}
            type="button"
            onClick={() => i !== screen && onJump(i)}
            aria-label={`Go to ${title}`}
            title={title}
            className={`rounded-full transition-all duration-300 ${
              i === screen
                ? "h-1.5 w-4 bg-gradient-to-r from-rose to-violet"
                : i < screen
                ? "h-1.5 w-1.5 bg-champagne/70"
                : "h-1.5 w-1.5 bg-soft/25"
            }`}
          />
        ))}
      </div>

      {/* next */}
      <NavButton onClick={onNext} disabled={screen === total - 1} ariaLabel="Next screen">
        <ChevronRight className="h-3.5 w-3.5" />
      </NavButton>

      {/* replay */}
      <span className="mx-0.5 h-3 w-px bg-soft/15" aria-hidden="true" />
      <NavButton onClick={onReplay} ariaLabel="Replay experience">
        <RotateCcw className="h-3 w-3" />
      </NavButton>

      {/* music */}
      <NavButton onClick={toggleMusic} ariaLabel={musicOn ? "Pause music" : "Play music"}>
        {musicOn ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
      </NavButton>

      {/* sound effects */}
      <NavButton onClick={toggleSfx} ariaLabel={sfxOn ? "Disable sound effects" : "Enable sound effects"}>
        {sfxOn ? <Headphones className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
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
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-soft/70 transition hover:bg-soft/10 hover:text-soft disabled:cursor-not-allowed disabled:opacity-25"
    >
      {children}
    </motion.button>
  );
}
