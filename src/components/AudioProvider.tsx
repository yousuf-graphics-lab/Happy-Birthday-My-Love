"use client";

// ---------------------------------------------------------------------------
// AudioProvider — exposes the audio engine to the React tree with reactive
// state. Handles:
//  - first-interaction unlock (never autoplays)
//  - music / sfx toggles with smooth gains
//  - pause when the tab is hidden, resume when visible
//  - persisted preferences
// ---------------------------------------------------------------------------

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { audioEngine, type SfxName } from "@/lib/audio";

type AudioState = {
  musicOn: boolean;
  sfxOn: boolean;
  unlocked: boolean;
  startMusic: () => void;
  playSfx: (name: SfxName) => void;
  toggleMusic: () => void;
  toggleSfx: () => void;
};

const AudioContext = createContext<AudioState | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState(() => audioEngine.getPreferences());
  const [unlocked, setUnlocked] = useState(false);

  // React to engine changes (toggles made elsewhere).
  useEffect(() => {
    const unsub = audioEngine.subscribe(() => setPrefs(audioEngine.getPreferences()));
    return () => {
      unsub();
    };
  }, []);

  // Pause audio when the tab is hidden; resume when it returns.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) audioEngine.suspend();
      else audioEngine.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const startMusic = useCallback(() => {
    audioEngine.unlock();
    audioEngine.startMusic();
    setUnlocked(true);
  }, []);

  const playSfx = useCallback((name: SfxName) => {
    audioEngine.unlock();
    audioEngine.playSfx(name);
  }, []);

  const toggleMusic = useCallback(() => {
    audioEngine.unlock();
    audioEngine.setMusicEnabled(!prefs.music);
    setUnlocked(true);
  }, [prefs.music]);

  const toggleSfx = useCallback(() => {
    audioEngine.unlock();
    audioEngine.setSfxEnabled(!prefs.sfx);
  }, [prefs.sfx]);

  const value = useMemo<AudioState>(
    () => ({
      musicOn: prefs.music,
      sfxOn: prefs.sfx,
      unlocked,
      startMusic,
      playSfx,
      toggleMusic,
      toggleSfx,
    }),
    [prefs.music, prefs.sfx, unlocked, startMusic, playSfx, toggleMusic, toggleSfx]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
