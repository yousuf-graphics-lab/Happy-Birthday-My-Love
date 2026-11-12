// ---------------------------------------------------------------------------
// Local-only photo storage.
// Photographs are compressed on upload, kept in localStorage and never sent
// anywhere. If storage is full we keep as many photos as fit and tell the
// caller so the UI can explain what happened.
// ---------------------------------------------------------------------------

export type MemoryPhoto = {
  id: string;
  src: string; // compressed data URL
  caption: string;
};

const STORE_KEY = "samiya-memories";
const MAX_PHOTOS = 10;
const MAX_EDGE = 1100; // px — keeps localStorage usage sane
const JPEG_QUALITY = 0.72;

export const PHOTO_LIMIT = MAX_PHOTOS;

function loadRaw(): MemoryPhoto[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as MemoryPhoto[];
    return [];
  } catch {
    return [];
  }
}

function saveAll(photos: MemoryPhoto[]): { ok: boolean; kept: number } {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(photos));
    return { ok: true, kept: photos.length };
  } catch {
    // Quota exceeded — drop oldest photos one at a time until it fits.
    let current = [...photos];
    while (current.length > 0) {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(current));
        return { ok: false, kept: current.length };
      } catch {
        current = current.slice(1);
      }
    }
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      /* ignore */
    }
    return { ok: false, kept: 0 };
  }
}

export function getMemories(): MemoryPhoto[] {
  if (typeof window === "undefined") return [];
  return loadRaw();
}

/** Compresses an image File into a JPEG data URL, downscaled if needed. */
export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("not-image"));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas-failed"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("load-failed"));
    };
    img.src = url;
  });
}

export function addMemory(file: File, caption: string): Promise<{
  ok: boolean;
  kept: number;
  full: boolean;
  error?: string;
}> {
  return compressImage(file)
    .then((src) => {
      const photos = loadRaw();
      if (photos.length >= MAX_PHOTOS) {
        return { ok: false, kept: photos.length, full: true };
      }
      const photo: MemoryPhoto = {
        id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        src,
        caption,
      };
      const next = [...photos, photo];
      const saved = saveAll(next);
      return {
        ok: saved.ok,
        kept: saved.kept,
        full: saved.kept >= MAX_PHOTOS,
        error: saved.ok ? undefined : "quota",
      };
    })
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : "unknown";
      return { ok: false, kept: loadRaw().length, full: false, error: message };
    });
}

export function removeMemory(id: string): MemoryPhoto[] {
  const photos = loadRaw().filter((p) => p.id !== id);
  saveAll(photos);
  return photos;
}

export function clearMemories(): void {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch {
    /* ignore */
  }
}
