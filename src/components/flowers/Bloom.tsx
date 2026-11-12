"use client";

// ---------------------------------------------------------------------------
// Bloom — ten hand-drawn SVG flowers, one per note.
// Every bloom is generated from a small spec (petal count, ring radii, palette)
// so the whole garden shares a language while each flower stays distinct.
// ---------------------------------------------------------------------------

export type BloomKind =
  | "rose"
  | "blush-rose"
  | "peony"
  | "lily"
  | "tulip"
  | "daisy"
  | "jasmine"
  | "gold"
  | "orchid"
  | "camellia";

type Ring = {
  count: number;
  radius: number;
  rx: number;
  ry: number;
  fill: string;
  opacity?: number;
  offset?: number;
  pointed?: boolean;
};

type Spec = {
  rings: Ring[];
  core: string;
  coreGlow?: string;
  stem?: boolean;
};

const ROSE_RINGS: Ring[] = [
  { count: 5, radius: 21, rx: 12, ry: 17, fill: "#ff5b93" },
  { count: 5, radius: 13, rx: 10, ry: 14, fill: "#ff8fbc", offset: 36 },
  { count: 4, radius: 6, rx: 7, ry: 10, fill: "#ffc7dc", offset: 18 },
];

const SPECS: Record<BloomKind, Spec> = {
  rose: { rings: ROSE_RINGS, core: "#c9316a", coreGlow: "rgba(255,77,141,0.45)" },
  "blush-rose": {
    rings: [
      { count: 5, radius: 21, rx: 12, ry: 17, fill: "#ffb3d1" },
      { count: 5, radius: 13, rx: 10, ry: 14, fill: "#ffd9e6", offset: 36 },
      { count: 4, radius: 6, rx: 7, ry: 10, fill: "#fff0f5", offset: 18 },
    ],
    core: "#e8558f",
    coreGlow: "rgba(255,179,209,0.45)",
  },
  peony: {
    rings: [
      { count: 8, radius: 22, rx: 11, ry: 15, fill: "#ff8ac1", opacity: 0.95 },
      { count: 7, radius: 15, rx: 10, ry: 13, fill: "#ffb3d1", offset: 25 },
      { count: 5, radius: 8, rx: 8, ry: 11, fill: "#ffe1ec", offset: 12 },
    ],
    core: "#ffd9a0",
    coreGlow: "rgba(255,140,180,0.45)",
  },
  lily: {
    rings: [
      { count: 6, radius: 22, rx: 9, ry: 21, fill: "#fff7fb", pointed: true },
      { count: 6, radius: 12, rx: 6, ry: 14, fill: "#ffe9c4", offset: 30, pointed: true },
    ],
    core: "#e8a33d",
    coreGlow: "rgba(255,247,251,0.5)",
  },
  tulip: {
    rings: [
      { count: 3, radius: 16, rx: 13, ry: 19, fill: "#ff6f91" },
      { count: 3, radius: 12, rx: 10, ry: 16, fill: "#ff9ec0", offset: 60 },
      { count: 2, radius: 6, rx: 7, ry: 11, fill: "#ffd0dd", offset: 20 },
    ],
    core: "#d94a86",
    coreGlow: "rgba(255,111,145,0.45)",
  },
  daisy: {
    rings: [
      { count: 14, radius: 22, rx: 6, ry: 20, fill: "#fff7fb", pointed: true },
      { count: 8, radius: 11, rx: 5, ry: 12, fill: "#ffe9c4", offset: 12, pointed: true },
    ],
    core: "#ffb347",
    coreGlow: "rgba(255,247,251,0.5)",
  },
  jasmine: {
    rings: [
      { count: 5, radius: 20, rx: 10, ry: 18, fill: "#fffdf7", pointed: true },
      { count: 5, radius: 10, rx: 6, ry: 11, fill: "#fff3d6", offset: 36, pointed: true },
    ],
    core: "#ffd9a0",
    coreGlow: "rgba(255,253,247,0.55)",
  },
  gold: {
    rings: [
      { count: 10, radius: 22, rx: 8, ry: 17, fill: "#ffd9a0" },
      { count: 8, radius: 13, rx: 6, ry: 12, fill: "#fff2cf", offset: 18 },
    ],
    core: "#c98a34",
    coreGlow: "rgba(255,217,160,0.5)",
  },
  orchid: {
    rings: [
      { count: 5, radius: 22, rx: 9, ry: 19, fill: "#d8b4fe", pointed: true },
      { count: 5, radius: 13, rx: 7, ry: 13, fill: "#f3e8ff", offset: 36, pointed: true },
      { count: 3, radius: 6, rx: 6, ry: 9, fill: "#faf5ff", offset: 20 },
    ],
    core: "#a855f7",
    coreGlow: "rgba(168,85,247,0.45)",
  },
  camellia: {
    rings: [
      { count: 6, radius: 21, rx: 12, ry: 16, fill: "#e94b83" },
      { count: 6, radius: 13, rx: 9, ry: 13, fill: "#ff8ac1", offset: 30 },
      { count: 5, radius: 6, rx: 6, ry: 9, fill: "#ffd0e1", offset: 18 },
    ],
    core: "#b8235c",
    coreGlow: "rgba(233,75,131,0.45)",
  },
};

export default function Bloom({
  kind,
  id,
  className = "",
}: {
  kind: BloomKind;
  id: string | number;
  className?: string;
}) {
  const spec = SPECS[kind] ?? SPECS.rose;
  const uid = `${kind}-${id}`;

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={{ filter: `drop-shadow(0 6px 16px ${spec.coreGlow ?? "rgba(255,77,141,0.35)"})` }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`core-${uid}`} cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fffaf0" stopOpacity="0.95" />
          <stop offset="55%" stopColor={spec.core} />
          <stop offset="100%" stopColor={spec.core} stopOpacity="0.9" />
        </radialGradient>
      </defs>

      {spec.rings.map((ring, ri) =>
        Array.from({ length: ring.count }).map((_, pi) => {
          const angle = (360 / ring.count) * pi + (ring.offset ?? 0);
          const cx = 60;
          const cy = 60 - ring.radius;
          const key = `${ri}-${pi}`;

          if (ring.pointed) {
            // a petal with a pointed tip, drawn from the centre outward
            const w = ring.rx;
            const h = ring.ry;
            return (
              <path
                key={key}
                d={`M${cx} ${cy - h} C${cx + w} ${cy - h * 0.35} ${cx + w * 0.8} ${cy + h * 0.55} ${cx} ${cy + h * 0.35} C${cx - w * 0.8} ${cy + h * 0.55} ${cx - w} ${cy - h * 0.35} ${cx} ${cy - h} Z`}
                fill={ring.fill}
                opacity={ring.opacity ?? 0.96}
                transform={`rotate(${angle} 60 60)`}
              />
            );
          }

          return (
            <ellipse
              key={key}
              cx={cx}
              cy={cy}
              rx={ring.rx}
              ry={ring.ry}
              fill={ring.fill}
              opacity={ring.opacity ?? 0.97}
              transform={`rotate(${angle} 60 60)`}
            />
          );
        })
      )}

      {/* heart */}
      <circle cx="60" cy="60" r="8.5" fill={`url(#core-${uid})`} />
      <circle cx="60" cy="60" r="3.2" fill={spec.core} opacity="0.85" />
      <circle cx="56.5" cy="56.5" r="1.8" fill="#fff7fb" opacity="0.7" />
    </svg>
  );
}
