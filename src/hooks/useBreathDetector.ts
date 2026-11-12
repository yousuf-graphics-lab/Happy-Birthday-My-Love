"use client";

// ---------------------------------------------------------------------------
// useBreathDetector — detects a blow (breath) against the microphone.
// Returns { enabled, listening, error, start, stop }.
// Permission is requested ONLY when start() is called from a user gesture.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "listening" | "error";

export function useBreathDetector(onBlow: () => void) {
  const [status, setStatus] = useState<Status>("idle");
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const onBlowRef = useRef(onBlow);
  const aboveCountRef = useRef(0);
  const blowCooldownRef = useRef(0);

  useEffect(() => {
    onBlowRef.current = onBlow;
  }, [onBlow]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (ctxRef.current && ctxRef.current.state !== "closed") {
      void ctxRef.current.close().catch(() => {});
    }
    ctxRef.current = null;
    analyserRef.current = null;
    setStatus("idle");
  }, []);

  const start = useCallback(async () => {
    if (status === "listening") {
      stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      analyserRef.current = analyser;
      setStatus("listening");

      const data = new Uint8Array(analyser.fftSize);
      const freq = new Uint8Array(analyser.frequencyBinCount);
      const now = () => performance.now();

      const tick = () => {
        if (!analyserRef.current) return;
        const a = analyserRef.current;
        a.getByteTimeDomainData(data);
        a.getByteFrequencyData(freq);
        // Breath energy: strong in low-mid frequencies, sudden broadband rise.
        let energy = 0;
        for (let i = 2; i < 240; i++) energy += freq[i];
        energy /= 238;
        let rms = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          rms += v * v;
        }
        rms = Math.sqrt(rms / data.length);

        const nowMs = now();
        const loud = energy > 55 || rms > 0.16;
        if (loud) {
          aboveCountRef.current++;
          if (aboveCountRef.current > 6 && nowMs - blowCooldownRef.current > 1500) {
            blowCooldownRef.current = nowMs;
            aboveCountRef.current = 0;
            onBlowRef.current();
          }
        } else {
          aboveCountRef.current = Math.max(0, aboveCountRef.current - 2);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setStatus("error");
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, [status, stop]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        void ctxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    status,
    listening: status === "listening",
    error: status === "error",
    start,
    stop,
  };
}
