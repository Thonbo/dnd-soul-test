import OpenAI from "openai";

type BackstoryVariantInput = {
  key: "core" | "shadow" | "safe";
  label: string;
  className: string;
  subclassName: string;
  raceName: string;
  classDesc: string;
  lawChaos: string;
  goodEvil: string;
};

type BackstoryContext = {
  archetypeLabel: string;
  flavorLines: string[];
};

function buildPrompt(variant: BackstoryVariantInput, context: BackstoryContext) {
  const subtype = variant.subclassName ? ` of the ${variant.subclassName}` : "";
  return [
    "Write one short fantasy character backstory for a Dungeons & Dragons personality result.",
    "Keep it evocative, readable, and specific.",
    "Length: 90 to 130 words.",
    "Use 1 short paragraph only.",
    "Do not use bullet points.",
    "Do not mention personality test, quiz, player, or result.",
    "Make it feel like an in-world origin sketch.",
    "",
    `Variant role: ${variant.label}`,
    `Character: ${variant.raceName} ${variant.className}${subtype}`,
    `Alignment: ${variant.lawChaos} ${variant.goodEvil}`,
    `Class essence: ${variant.classDesc}`,
    `Archetype resonance: ${context.archetypeLabel}`,
    `Behavior notes: ${context.flavorLines.join(" | ")}`,
  ].join("\n");
}

function buildGroupedPrompt(variants: BackstoryVariantInput[], context: BackstoryContext) {
  return [
    "Write three short fantasy backstories for three different Dungeons & Dragons character concepts.",
    "Each backstory must feel clearly different in tone, life path, social station, and imagery.",
    "Avoid repeated structures, repeated motifs, and repeated sentence rhythms.",
    "Make the first feel like the most natural destiny, the second feel darker or more volatile, and the third feel steadier or safer without sounding boring.",
    "Length: 90 to 130 words each.",
    "Return strict JSON with keys core, shadow, safe.",
    "Each value must be a single short paragraph string.",
    "Do not mention quizzes, tests, players, or results.",
    "",
    `Archetype resonance: ${context.archetypeLabel}`,
    `Behavior notes: ${context.flavorLines.join(" | ")}`,
    "",
    ...variants.map((variant) => {
      const subtype = variant.subclassName ? ` of the ${variant.subclassName}` : "";
      return [
        `[${variant.key}]`,
        `Role: ${variant.label}`,
        `Character: ${variant.raceName} ${variant.className}${subtype}`,
        `Alignment: ${variant.lawChaos} ${variant.goodEvil}`,
        `Class essence: ${variant.classDesc}`,
      ].join("\n");
    }),
  ].join("\n");
}

export const handler = async (event: { httpMethod?: string; body?: string | null }) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "OPENAI_API_KEY is not configured." }) };
    }

    const payload = JSON.parse(event.body ?? "{}") as {
      variants: BackstoryVariantInput[];
      context: BackstoryContext;
    };

    const openai = new OpenAI({ apiKey });
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: buildGroupedPrompt(payload.variants, payload.context),
      text: {
        format: {
          type: "json_schema",
          name: "backstories",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              core: { type: "string" },
              shadow: { type: "string" },
              safe: { type: "string" },
            },
            required: ["core", "shadow", "safe"],
          },
        },
      },
    });

    const output = JSON.parse(response.output_text) as Record<"core" | "shadow" | "safe", string>;

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(output),
    };
  } catch (error) {
    console.error("Backstory function failed:", error);
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown backstory function error",
      }),
    };
  }
};
