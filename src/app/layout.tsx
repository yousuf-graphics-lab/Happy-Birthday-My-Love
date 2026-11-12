import type { Metadata, Viewport } from "next";
import "./globals.css";

// Self-hosted fonts via fontsource (no external requests at runtime)
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/500.css";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import "@fontsource/noto-sans-devanagari/400.css";
import "@fontsource/noto-sans-devanagari/500.css";
import "@fontsource/noto-sans-devanagari/600.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "For Samiya 💕",
  description:
    "A little universe made just for you. A beautiful birthday surprise created with love.",
  keywords: ["birthday", "celebration", "love", "Samiya"],
  authors: [{ name: "Yousuf" }],
  openGraph: {
    title: "For Samiya 💕",
    description:
      "A little universe made just for you. A beautiful birthday surprise created with love.",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "For Samiya — A Little Universe Made Just For You",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "For Samiya 💕",
    description:
      "A little universe made just for you. A beautiful birthday surprise created with love.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0713",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full overflow-x-hidden">{children}</body>
    </html>
  );
}
