"use client";

// ---------------------------------------------------------------------------
// The experience orchestrator.
// Manages the seven cinematic screens, their transitions, and the journey
// navigation. The first interaction (opening the envelope) unlocks audio.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import Atmosphere from "@/components/Atmosphere";
import { AudioProvider, useAudio } from "@/components/AudioProvider";
import JourneyNav from "@/components/JourneyNav";
import Screen01Welcome from "@/components/screens/Screen01Welcome";
import Screen02Reveal from "@/components/screens/Screen02Reveal";
import Screen03Letter from "@/components/screens/Screen03Letter";
import Screen04Bouquet from "@/components/screens/Screen04Bouquet";
import Screen05Memories from "@/components/screens/Screen05Memories";
import Screen06Reasons from "@/components/screens/Screen06Reasons";
import Screen07Finale from "@/components/screens/Screen07Finale";

const SCREENS = 7;

function Experience() {
  const [screen, setScreen] = useState(0);
  const { playSfx } = useAudio();

  const goTo = useCallback(
    (next: number) => {
      playSfx("click");
      setScreen((prev) => Math.max(0, Math.min(SCREENS - 1, next === prev ? prev : next)));
    },
    [playSfx]
  );

  const replay = useCallback(() => {
    playSfx("chime");
    setScreen(0);
  }, [playSfx]);

  return (
    <div className="midnight-bg relative min-h-screen w-full overflow-hidden">
      <Atmosphere />

      <main className="relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {screen === 0 && <Screen01Welcome onContinue={() => goTo(1)} />}
            {screen === 1 && <Screen02Reveal onContinue={() => goTo(2)} />}
            {screen === 2 && <Screen03Letter onContinue={() => goTo(3)} />}
            {screen === 3 && <Screen04Bouquet onContinue={() => goTo(4)} />}
            {screen === 4 && <Screen05Memories onContinue={() => goTo(5)} />}
            {screen === 5 && <Screen06Reasons onContinue={() => goTo(6)} />}
            {screen === 6 && <Screen07Finale onReplay={replay} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <JourneyNav
        screen={screen}
        total={SCREENS}
        onPrev={() => goTo(screen - 1)}
        onNext={() => goTo(screen + 1)}
        onJump={goTo}
        onReplay={replay}
      />
    </div>
  );
}

export default function Page() {
  return (
    <AudioProvider>
      <Experience />
    </AudioProvider>
  );
}
