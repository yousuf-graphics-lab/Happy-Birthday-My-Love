"use client";

// ---------------------------------------------------------------------------
// SCREEN 05 — OUR LITTLE MEMORIES
// Premium photo gallery: upload up to 10 photographs (kept on-device only),
// glass frames with rose/violet glow, lightbox with swipe navigation,
// zoom animations and rotating captions. Beautiful empty state.
// ---------------------------------------------------------------------------

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, ImagePlus, Trash2, X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import MagicButton from "@/components/ui/MagicButton";
import { useAudio } from "@/components/AudioProvider";
import { MEMORIES } from "@/lib/content";
import {
  addMemory,
  getMemories,
  PHOTO_LIMIT,
  removeMemory,
  type MemoryPhoto,
} from "@/lib/storage";

export default function Screen05Memories({ onContinue }: { onContinue: () => void }) {
  const { playSfx } = useAudio();
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setPhotos(getMemories());
  }, []);

  const refresh = useCallback(() => setPhotos(getMemories()), []);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setNotice(null);
      let added = 0;
      for (const file of Array.from(files)) {
        // stop at the limit
        if (getMemories().length >= PHOTO_LIMIT) break;
        const caption = MEMORIES.captions[added % MEMORIES.captions.length];
        const result = await addMemory(file, caption);
        if (result.ok) added++;
        else if (result.full) {
          setNotice(MEMORIES.fullHint);
          break;
        } else {
          setNotice("Couldn't save that photo — try another one 💕");
        }
      }
      if (added > 0) {
        playSfx("sparkle");
        refresh();
      }
      if (fileRef.current) fileRef.current.value = "";
    },
    [playSfx, refresh]
  );

  const handleDelete = (id: string) => {
    removeMemory(id);
    refresh();
    setLightbox(null);
  };

  const captionFor = (i: number) => MEMORIES.captions[i % MEMORIES.captions.length];

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-4xl text-soft sm:text-5xl"
      >
        {MEMORIES.heading}
      </motion.h2>

      <div className="mt-10 w-full max-w-4xl">
        {photos.length === 0 ? (
          /* ------------------- empty state ------------------- */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong flex flex-col items-center gap-5 rounded-3xl p-10 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl"
            >
              📸
            </motion.div>
            <p className="font-display text-2xl text-soft">{MEMORIES.emptyTitle}</p>
            <p className="max-w-sm text-sm leading-relaxed text-soft/60">
              {MEMORIES.emptyBody}
            </p>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => void handleFiles(e.target.files)}
                className="hidden"
              />
              <MagicButton onClick={() => fileRef.current?.click()} tone="gold">
                <ImagePlus className="h-4 w-4" />
                {MEMORIES.addButton}
              </MagicButton>
            </div>
            <p className="text-xs text-soft/40">
              {PHOTO_LIMIT} photographs · stored only on this device
            </p>
          </motion.div>
        ) : (
          /* ------------------- gallery ------------------- */
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
              <AnimatePresence>
                {photos.map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group relative"
                  >
                    <button
                      type="button"
                      onClick={() => setLightbox(i)}
                      className="block w-full overflow-hidden rounded-2xl border border-rose/25 bg-plum/50 shadow-[0_0_40px_-15px_rgba(255,77,141,0.6)] transition group-hover:-translate-y-1 group-hover:border-rose/50"
                    >
                      <img
                        src={photo.src}
                        alt={captionFor(i)}
                        className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </button>
                    <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-lg bg-black/50 px-2 py-1 text-center text-[11px] text-soft/80 backdrop-blur">
                      {captionFor(i)}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(photo.id)}
                      aria-label="Remove photo"
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-soft/70 opacity-0 backdrop-blur transition hover:text-rose group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {photos.length < PHOTO_LIMIT && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-soft/20 text-soft/50 transition hover:border-rose/50 hover:text-soft"
                >
                  <ImagePlus className="h-7 w-7" />
                  <span className="text-sm">Add more</span>
                </button>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => void handleFiles(e.target.files)}
              className="hidden"
            />

            {notice && <p className="mt-4 text-center text-sm text-champagne/80">{notice}</p>}
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12"
      >
        <MagicButton onClick={onContinue} tone="gold">
          <Heart className="h-4 w-4 fill-current" strokeWidth={1.5} />
          {MEMORIES.continue}
        </MagicButton>
      </motion.div>

      {/* ------------------- lightbox ------------------- */}
      <AnimatePresence>
        {lightbox !== null && photos[lightbox] && (
          <Lightbox
            index={lightbox}
            photos={photos}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox((i) => (i === null ? i : (i - 1 + photos.length) % photos.length))}
            onNext={() => setLightbox((i) => (i === null ? i : (i + 1) % photos.length))}
            caption={captionFor(lightbox)}
            onDelete={() => handleDelete(photos[lightbox].id)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function Lightbox({
  index,
  photos,
  onClose,
  onPrev,
  onNext,
  caption,
  onDelete,
}: {
  index: number;
  photos: MemoryPhoto[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  caption: string;
  onDelete: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const touchStart = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) onNext();
      else onPrev();
    }
    touchStart.current = null;
  };

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[88vh] w-full max-w-3xl flex-col items-center gap-4"
      >
        <div className="flex w-full items-center justify-between">
          <span className="text-sm text-soft/60">
            {index + 1} / {photos.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-soft transition hover:bg-rose/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="flex w-full items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous"
            className="absolute left-1 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-soft transition hover:bg-rose/30 sm:left-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <motion.img
            key={index}
            src={photos[index].src}
            alt={caption}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: zoomed ? 1.6 : 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
            className="max-h-[70vh] w-auto max-w-full select-none rounded-2xl border border-rose/25 shadow-[0_0_80px_-20px_rgba(255,77,141,0.8)]"
            onClick={() => setZoomed((z) => !z)}
          />

          <button
            type="button"
            onClick={onNext}
            aria-label="Next"
            className="absolute right-1 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-soft transition hover:bg-rose/30 sm:right-2"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex-1 text-center">
            <p className="text-sm italic text-soft/80">{caption}</p>
          </div>
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            aria-label="Zoom"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-soft transition hover:bg-rose/30"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete photo"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-soft transition hover:bg-rose/40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
