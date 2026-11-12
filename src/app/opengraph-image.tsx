import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "For Samiya — A Little Universe Made Just For You";
export const size = { width: 1200, height: 630 } as const;
export const contentType = "image/png";

// Self-hosted TTF fonts (converted from fontsource woff files) so the OG
// image needs no network and Satori can parse them.
const playfair700 = await readFile(
  join(process.cwd(), "src", "assets", "fonts", "PlayfairDisplay-700.ttf")
);
const inter400 = await readFile(
  join(process.cwd(), "src", "assets", "fonts", "Inter-400.ttf")
);

// Stars are positioned from one edge only — Satori crashes on undefined
// style props, so every star object carries exactly one of the two keys.
const STARS: Array<{ top: number; left?: number; right?: number }> = [
  { top: 70, left: 90 },
  { top: 90, right: 120 },
  { top: 470, left: 150 },
  { top: 500, right: 170 },
  { top: 300, left: 70 },
  { top: 320, right: 90 },
];

// Image generation
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b0713",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, #2a1448 0%, rgba(11,7,19,0) 60%), radial-gradient(circle at 12% 30%, rgba(168,85,247,0.35) 0%, rgba(11,7,19,0) 55%), radial-gradient(circle at 88% 40%, rgba(255,77,141,0.35) 0%, rgba(11,7,19,0) 55%)",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* glowing heart */}
        <div
          style={{
            width: 132,
            height: 132,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9999px",
            backgroundColor: "rgba(255,77,141,0.18)",
            border: "2px solid rgba(255,217,160,0.35)",
          }}
        >
          <svg width="76" height="76" viewBox="0 0 64 64">
            <path
              d="M32 52s-15.5-9.4-15.5-20.6C16.5 24.9 21.4 22 26.6 22c2.9 0 5.5 1.5 6.3 3.7.8-2.2 3.4-3.7 6.3-3.7 5.2 0 10.1 2.9 10.1 11.7C47.5 42.6 32 52 32 52z"
              fill="#ff4d8d"
            />
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Playfair Display",
            fontWeight: 700,
            fontSize: 108,
            color: "#fff7fb",
            textAlign: "center",
            letterSpacing: "-1px",
          }}
        >
          For Samiya
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: 26,
            color: "#ffd9a0",
            marginTop: 20,
            letterSpacing: "10px",
          }}
        >
          A LITTLE UNIVERSE
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: 24,
            color: "rgba(255,247,251,0.72)",
            marginTop: 18,
          }}
        >
          A birthday surprise, made only for you
        </div>

        {/* scattered stars */}
        {STARS.map((star, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: star.top,
              ...(star.left !== undefined ? { left: star.left } : {}),
              ...(star.right !== undefined ? { right: star.right } : {}),
              width: 9,
              height: 9,
              borderRadius: "9999px",
              backgroundColor: i % 2 ? "#ffd9a0" : "#ff4d8d",
            }}
          />
        ))}
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair Display", data: playfair700, weight: 700, style: "normal" },
        { name: "Inter", data: inter400, weight: 400, style: "normal" },
      ],
    }
  );
}
