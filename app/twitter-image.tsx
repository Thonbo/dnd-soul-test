import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "The Oracle's Mirror";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "radial-gradient(circle at top, #201006 0%, #050200 70%)",
          color: "#c8a96e",
          padding: "72px",
          textAlign: "center",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 84,
            lineHeight: 1,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          The Oracle&apos;s Mirror
        </div>
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          A Dungeons &amp; Dragons Personality Test
        </div>
        <div
          style={{
            width: 240,
            height: 4,
            background: "linear-gradient(90deg, #7a0e0e, #c8a96e)",
            marginBottom: 28,
          }}
        />
        <div
          style={{
            fontSize: 34,
            lineHeight: 1.35,
            maxWidth: 900,
            color: "#f0ddb0",
          }}
        >
          Discover your class, race, alignment, and shadow path through immersive moral dilemmas.
        </div>
      </div>
    ),
    size,
  );
}
