import DndTest from "@/components/DndTest";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "The Oracle's Mirror",
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    url: "https://the-oracles-mirror.netlify.app",
    description:
      "A Dungeons & Dragons personality test that reveals your class, race, alignment, and shadow path through immersive moral dilemmas.",
    genre: ["Fantasy", "Role-playing", "Personality quiz"],
    inLanguage: "en",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="sr-only">
        <h1>The Oracle&apos;s Mirror</h1>
        <p>
          The Oracle&apos;s Mirror is a Dungeons &amp; Dragons personality test that matches players
          to a fantasy class, race, alignment, archetype, and shadow path through a series of moral
          dilemmas and role-playing choices.
        </p>
      </section>
      <DndTest />
    </main>
  );
}
