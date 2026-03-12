import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Oracle's Mirror — D&D Soul Test",
  description: "Discover your true D&D character through 32 binary questions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
