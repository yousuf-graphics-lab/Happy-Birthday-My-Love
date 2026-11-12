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
import { audioEngine, DEFAULT_AUDIO_PREFS, type SfxName } from "@/lib/audio";

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
  // The first render must be identical on the server and the client, so start
  // from the defaults and only then adopt whatever is stored on this device.
  // Reading localStorage during render is what caused the hydration mismatch.
  const [prefs, setPrefs] = useState(DEFAULT_AUDIO_PREFS);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setPrefs(audioEngine.getPreferences());
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
