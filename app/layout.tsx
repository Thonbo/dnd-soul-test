import type { Metadata } from "next";
import { UnifrakturCook } from "next/font/google";
import "./globals.css";

const unifraktur = UnifrakturCook({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-unifraktur",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Oracle's Mirror — D&D Soul Test",
  description:
    "Discover your true Dungeons & Dragons character through 32 binary moral dilemmas. Find your class, race, alignment, and shadow path in this immersive D&D personality quiz.",
  keywords: [
    "D&D personality test",
    "Dungeons and Dragons quiz",
    "DnD character quiz",
    "D&D alignment test",
    "D&D class quiz",
    "fantasy personality test",
    "RPG character builder",
  ],
  openGraph: {
    title: "The Oracle's Mirror — D&D Soul Test",
    description:
      "Discover your true D&D character through 32 binary moral dilemmas. Class, race, alignment & shadow path revealed.",
    type: "website",
    siteName: "The Oracle's Mirror",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Oracle's Mirror — D&D Soul Test",
    description:
      "Discover your true D&D character through 32 binary moral dilemmas.",
  },
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={unifraktur.variable}>
      <body>{children}</body>
    </html>
  );
}
