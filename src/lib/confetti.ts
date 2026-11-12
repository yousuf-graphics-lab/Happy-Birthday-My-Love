// ---------------------------------------------------------------------------
// Confetti helpers built on canvas-confetti
// ---------------------------------------------------------------------------

import confetti from "canvas-confetti";

const PALETTE = ["#ff4d8d", "#a855f7", "#ffd9a0", "#fff7fb", "#ff8ac1"];

// canvas-confetti's runtime supports the `emoji` option, but the bundled
// @types package is older and doesn't declare it — cast through unknown.
type EmojiOptions = Parameters<typeof confetti>[0] & {
  emoji?: string[];
};

function emojiConfetti(options: EmojiOptions) {
  confetti(options as Parameters<typeof confetti>[0]);
}

export function goldenBurst(x = 0.5, y = 0.5) {
  confetti({
    particleCount: 140,
    spread: 130,
    startVelocity: 55,
    origin: { x, y },
    colors: ["#ffd9a0", "#ffe9c4", "#ffb3d1", "#fff7fb"],
    scalar: 1.1,
    ticks: 220,
    gravity: 0.85,
    disableForReducedMotion: true,
  });
}

export function celebrationBurst() {
  confetti({
    particleCount: 200,
    spread: 100,
    startVelocity: 60,
    angle: 60,
    colors: PALETTE,
    scalar: 1.15,
    ticks: 300,
    disableForReducedMotion: true,
  });
  setTimeout(() => {
    confetti({
      particleCount: 160,
      spread: 100,
      startVelocity: 55,
      angle: 120,
      colors: PALETTE,
      scalar: 1.15,
      ticks: 300,
      disableForReducedMotion: true,
    });
  }, 220);
  setTimeout(() => {
    emojiConfetti({
      particleCount: 120,
      spread: 150,
      startVelocity: 30,
      origin: { x: 0.5, y: 0.7 },
      colors: ["#ff4d8d", "#ffd9a0"],
      emoji: ["❤️", "✨"],
      scalar: 1.6,
      ticks: 300,
      disableForReducedMotion: true,
    });
  }, 450);
}

export function rosePetalShower() {
  const petals = ["🌹", "🌸", "💗", "✨"];
  emojiConfetti({
    particleCount: 90,
    spread: 90,
    startVelocity: 45,
    angle: 90,
    origin: { x: 0.5, y: 1 },
    colors: ["#ff4d8d", "#ffb3d1", "#ffd9a0"],
    emoji: petals,
    scalar: 1.5,
    ticks: 320,
    disableForReducedMotion: true,
  });
  setTimeout(() => {
    emojiConfetti({
      particleCount: 70,
      spread: 80,
      startVelocity: 40,
      angle: 90,
      origin: { x: 0.25, y: 1 },
      emoji: petals,
      scalar: 1.4,
      ticks: 320,
      disableForReducedMotion: true,
    });
  }, 260);
  setTimeout(() => {
    emojiConfetti({
      particleCount: 70,
      spread: 80,
      startVelocity: 40,
      angle: 90,
      origin: { x: 0.75, y: 1 },
      emoji: petals,
      scalar: 1.4,
      ticks: 320,
      disableForReducedMotion: true,
    });
  }, 520);
}

export function finaleBurst() {
  celebrationBurst();
  setTimeout(celebrationBurst, 900);
  setTimeout(celebrationBurst, 1900);
}
