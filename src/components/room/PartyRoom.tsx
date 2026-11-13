// ---------------------------------------------------------------------------
// PartyRoom — the decorated room the cake stands in.
// A midnight party wall with a frame of colourful strip lights, a sagging
// strand of fairy bulbs, warm bokeh in the air and a pool of light on the
// floor. Pure CSS/SVG, nothing but light — it never steals the cake's moment.
// ---------------------------------------------------------------------------

const BULB_COLORS = ["#ff4d8d", "#ffd9a0", "#a855f7", "#67e8f9", "#ff8ac1"];

// A quadratic curve from (0,6) to (100,6) sagging to y≈44 — the wire.
const WIRE_PATH = "M0 6 Q50 46 100 6";

const STRAND = Array.from({ length: 11 }, (_, i) => {
  const t = i / 10;
  const y = (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * 46 + t * t * 6;
  return {
    left: t * 100,
    top: y * 2,
    color: BULB_COLORS[i % BULB_COLORS.length],
    delay: (i % 5) * 0.42,
  };
});

const BOKEH = [
  { left: "12%", top: "30%", size: 120, color: "rgba(255,77,141,0.22)", delay: "0s", duration: "14s" },
  { left: "82%", top: "24%", size: 100, color: "rgba(168,85,247,0.22)", delay: "1.6s", duration: "17s" },
  { left: "70%", top: "58%", size: 150, color: "rgba(255,217,160,0.14)", delay: "0.8s", duration: "19s" },
  { left: "24%", top: "62%", size: 130, color: "rgba(103,232,249,0.12)", delay: "2.4s", duration: "16s" },
];

export default function PartyRoom() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* A cozy birthday bedroom, with a warm veil for readable foreground text. */}
      <div className="absolute inset-0 bg-[#452433] bg-[url('/images/birthday-room.webp')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(35,12,25,0.55),rgba(45,15,29,0.45)_45%,rgba(20,8,18,0.7))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(20,6,19,0.35)_100%)]" />

      {/* --------------------------- strip lights: top --------------------------- */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#ff4d8d,#a855f7,#67e8f9,#ffd9a0,#ff8ac1,#ff4d8d)] opacity-90" />
      <div className="absolute inset-x-0 top-0 h-[3px] animate-twinkle bg-[linear-gradient(90deg,#ffd9a0,#ff8ac1,#67e8f9,#a855f7,#ff4d8d)] opacity-70" />
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,77,141,0.28),rgba(168,85,247,0.1)_42%,transparent)] blur-2xl" />

      {/* ------------------------- strip lights: the sides ------------------------- */}
      <div className="absolute inset-y-0 left-0 w-[3px] bg-[linear-gradient(180deg,#ff4d8d,#a855f7,#67e8f9,#ffd9a0)] opacity-75" />
      <div className="absolute inset-y-0 left-0 w-[3px] animate-twinkle bg-[linear-gradient(180deg,#ffd9a0,#67e8f9,#ff8ac1,#a855f7)] opacity-60" />
      <div className="absolute inset-y-0 left-0 w-16 bg-[linear-gradient(90deg,rgba(255,77,141,0.24),transparent)] blur-2xl" />

      <div className="absolute inset-y-0 right-0 w-[3px] bg-[linear-gradient(180deg,#ffd9a0,#67e8f9,#a855f7,#ff4d8d)] opacity-75" />
      <div className="absolute inset-y-0 right-0 w-[3px] animate-twinkle bg-[linear-gradient(180deg,#a855f7,#ff8ac1,#ffd9a0,#67e8f9)] opacity-60" />
      <div className="absolute inset-y-0 right-0 w-16 bg-[linear-gradient(270deg,rgba(168,85,247,0.24),transparent)] blur-2xl" />

      {/* A gentle ribbon of colour across the wall behind the cake. */}
      <div className="absolute inset-x-0 bottom-[32%] h-px bg-[linear-gradient(90deg,transparent,#ff4d8d,#a855f7,#67e8f9,#ffd9a0,transparent)] opacity-60" />
      <div className="absolute inset-x-0 bottom-[32%] h-4 bg-[linear-gradient(90deg,transparent,rgba(255,77,141,0.25),rgba(168,85,247,0.3),rgba(103,232,249,0.2),transparent)] blur-lg" />

      {/* --------------------------- fairy light strand --------------------------- */}
      <div className="absolute inset-x-0 top-1 h-28">
        <svg
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <path
            d={WIRE_PATH}
            fill="none"
            stroke="rgba(255,217,160,0.28)"
            strokeWidth="0.35"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {STRAND.map((bulb, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 -translate-x-1/2 rounded-full animate-twinkle"
            style={{
              left: `${bulb.left}%`,
              top: `${bulb.top}%`,
              marginTop: "2px",
              background: bulb.color,
              boxShadow: `0 0 10px 2px ${bulb.color}`,
              animationDelay: `${bulb.delay}s`,
              animationDuration: `${2.6 + (i % 3) * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* ------------------------------- bokeh ------------------------------- */}
      {BOKEH.map((orb, i) => (
        <span
          key={i}
          className="absolute rounded-full blur-3xl animate-float-slow"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            animationDelay: orb.delay,
            animationDuration: orb.duration,
          }}
        />
      ))}

      {/* -------------------- pool of light where the cake stands -------------------- */}
      <div className="absolute bottom-[6%] left-1/2 h-24 w-[380px] max-w-[86vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,217,160,0.26),rgba(255,77,141,0.12)_45%,transparent_72%)] blur-xl" />
      <div className="absolute bottom-[9%] left-1/2 h-10 w-[240px] max-w-[70vw] -translate-x-1/2 rounded-[50%] bg-black/45 blur-xl" />

      {/* tiny confetti dots on the wall, like a party left mid-celebration */}
      {[
        { l: "18%", t: "18%", c: "#ffd9a0" },
        { l: "36%", t: "12%", c: "#ff8ac1" },
        { l: "62%", t: "15%", c: "#67e8f9" },
        { l: "74%", t: "40%", c: "#a855f7" },
        { l: "28%", t: "44%", c: "#ff4d8d" },
      ].map((dot, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full animate-twinkle"
          style={{
            left: dot.l,
            top: dot.t,
            background: dot.c,
            boxShadow: `0 0 8px 1px ${dot.c}`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: "4.5s",
          }}
        />
      ))}
    </div>
  );
}
