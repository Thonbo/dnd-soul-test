import type { Metadata } from "next";
import { Cormorant_Garamond, UnifrakturCook } from "next/font/google";
import "./globals.css";

const siteUrl = "https://the-oracles-mirror.netlify.app";

const unifraktur = UnifrakturCook({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-unifraktur",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Oracle's Mirror — D&D Soul Test",
    description:
      "Discover your true D&D character through 32 binary moral dilemmas. Class, race, alignment & shadow path revealed.",
    type: "website",
    siteName: "The Oracle's Mirror",
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "The Oracle's Mirror Dungeons & Dragons personality test",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Oracle's Mirror — D&D Soul Test",
    description:
      "Discover your true D&D character through 32 binary moral dilemmas.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${unifraktur.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${unifraktur.variable} ${cormorant.variable}`}>{children}</body>
    </html>
  );
}
