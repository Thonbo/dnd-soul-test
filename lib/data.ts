import questionsRaw from "../extended questions/dnd_personality_test_starter_v3/questions.json";
import classesRaw from "../new system/dnd_personality_test_starter/classes.json";
import subclassesRaw from "../new system/dnd_personality_test_starter/subclasses.json";
import racesRaw from "../new system/dnd_personality_test_starter/races.json";
import archetypesRaw from "../new system/dnd_personality_test_starter/archetypes.json";
import synergyRulesRaw from "../new system/dnd_personality_test_starter/synergyRules.json";
import penaltyRulesRaw from "../new system/dnd_personality_test_starter/penaltyRules.json";
import { TraitKey, ALL_TRAITS } from "./types";

// ─── core types ──────────────────────────────────────────────
export type Scores = Record<TraitKey, number>;

export const ZERO: Scores = Object.fromEntries(
  ALL_TRAITS.map(t => [t, 0])
) as Scores;

// ─── question pool ────────────────────────────────────────────
export type Question = {
  id: string; category: string; text: string;
  a: { label: string; weights: Partial<Scores> };
  b: { label: string; weights: Partial<Scores> };
};

export const QUESTION_POOL: Question[] = questionsRaw.map(q => ({
  id: q.id,
  category: q.category,
  text: q.text,
  a: { label: q.optionA.label, weights: q.optionA.weights as Partial<Scores> },
  b: { label: q.optionB.label, weights: q.optionB.weights as Partial<Scores> },
}));

export const QUIZ_SIZE = 50;

/** Fisher-Yates shuffle in-place */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Category-balanced sample — draws proportionally from each category.
 * With 5 equal-weight categories (20% each), a 50-question session yields 10 per category.
 * Remainder slots are distributed by fractional largest-remainder method.
 */
export function sampleQuestions(n: number = QUIZ_SIZE): Question[] {
  const CATEGORY_WEIGHT = 0.2;
  const categories = ["identity", "power", "combat", "social", "aesthetic"];

  // Group pool by category
  const byCategory: Record<string, Question[]> = {};
  for (const cat of categories) byCategory[cat] = [];
  for (const q of QUESTION_POOL) {
    if (byCategory[q.category]) byCategory[q.category].push(q);
  }

  // Proportional allocation with largest-remainder
  const raw = categories.map(cat => n * CATEGORY_WEIGHT);
  const floored = raw.map(Math.floor);
  const remainders = raw.map((v, i) => v - floored[i]);
  let remaining = n - floored.reduce((a, b) => a + b, 0);
  const order = remainders
    .map((r, i) => ({ i, r }))
    .sort((a, b) => b.r - a.r);
  for (const { i } of order) {
    if (remaining <= 0) break;
    floored[i]++;
    remaining--;
  }

  // Sample from each category, then merge and shuffle
  const selected: Question[] = [];
  for (let i = 0; i < categories.length; i++) {
    const pool = shuffle([...byCategory[categories[i]]]);
    selected.push(...pool.slice(0, Math.min(floored[i], pool.length)));
  }
  return shuffle(selected);
}

// ─── normalization (per sampled set) ─────────────────────────
function computeMaxPossible(questions: Question[]): Scores {
  const max: Scores = { ...ZERO };
  for (const q of questions) {
    for (const t of ALL_TRAITS) {
      const wa = (q.a.weights as Record<string, number>)[t] ?? 0;
      const wb = (q.b.weights as Record<string, number>)[t] ?? 0;
      max[t] += Math.max(wa, wb);
    }
  }
  return max;
}

function normalize(raw: Scores, maxPossible: Scores): Scores {
  const n: Scores = { ...ZERO };
  for (const t of ALL_TRAITS) {
    n[t] = maxPossible[t] > 0
      ? Math.round((raw[t] / maxPossible[t]) * 100)
      : 0;
  }
  return n;
}

// ─── scoring helpers ──────────────────────────────────────────
function dotScore(norm: Scores, weights: Partial<Scores>): number {
  const entries = Object.entries(weights) as [TraitKey, number][];
  if (entries.length === 0) return 0;
  const totalWeight = entries.reduce((s, [, v]) => s + Math.abs(v), 0);
  const raw = entries.reduce((s, [k, v]) => s + norm[k] * v, 0);
  return totalWeight > 0 ? raw / totalWeight : 0;
}

type Condition = { trait: string; operator: string; value: number };

function checkAll(norm: Scores, conditions: Condition[]): boolean {
  return conditions.every(c => {
    const v = norm[c.trait as TraitKey];
    if (c.operator === ">=") return v >= c.value;
    if (c.operator === ">")  return v >  c.value;
    if (c.operator === "<")  return v <  c.value;
    return false;
  });
}

// ─── trait display labels ─────────────────────────────────────
const TRAIT_LABELS: Record<TraitKey, string> = {
  order: "Order",       chaos: "Chaos",         duty: "Duty",
  freedom: "Freedom",   logic: "Logic",         instinct: "Instinct",
  mercy: "Mercy",       ruthlessness: "Ruthless", honor: "Honor",
  pragmatism: "Pragmatic", leadership: "Leader",  solitude: "Solitude",
  spotlight: "Spotlight",  subtlety: "Subtlety",  outsider: "Outsider",
  nobility: "Nobility",    martial_affinity: "Martial", arcane_affinity: "Arcane",
  divine_affinity: "Divine", primal_affinity: "Primal", shadow_affinity: "Shadow",
  trickster_affinity: "Trickster", frontline: "Frontline", backline: "Backline",
  control: "Control",   destruction: "Destroy",  support: "Support",
  mobility: "Mobility", resilience: "Resilience", complexity: "Complexity",
};

// ─── result type ──────────────────────────────────────────────
export type ComputedResult = {
  className: string;
  subclassName: string;
  classDesc: string;
  raceName: string;
  topTraits: Array<{ key: TraitKey; label: string; pct: number }>;
  archetypeLabel: string;
  archetypeDesc: string;
  lawChaos: string;
  goodEvil: string;
  shadowClassName: string;
  shadowSubclassName: string;
  shadowClassDesc: string;
  flavorLines: string[];
};

// ─── main scoring engine ──────────────────────────────────────
export function computeResult(raw: Scores, questions: Question[]): ComputedResult {
  const norm = normalize(raw, computeMaxPossible(questions));

  // Score all classes
  const scoredClasses = classesRaw
    .map(c => {
      let score = dotScore(norm, c.weights as Partial<Scores>);
      for (const rule of synergyRulesRaw) {
        if (rule.appliesTo.classId === c.id && !rule.appliesTo.subclassId) {
          if (checkAll(norm, rule.allOf)) score += rule.bonus;
        }
      }
      for (const rule of penaltyRulesRaw) {
        if (rule.appliesTo.classId === c.id && !rule.appliesTo.subclassId) {
          const hit = (rule.allOf ? checkAll(norm, rule.allOf) : false)
            || (rule.anyOf ? rule.anyOf.some(g => checkAll(norm, g.allOf)) : false);
          if (hit) score -= rule.penalty;
        }
      }
      return { ...c, score };
    })
    .sort((a, b) => b.score - a.score);

  const topClass    = scoredClasses[0];
  const shadowClass = scoredClasses[1];

  // Best subclass for top class
  const bestSub = subclassesRaw
    .filter(s => s.classId === topClass.id)
    .map(s => {
      let score = dotScore(norm, s.weights as Partial<Scores>);
      for (const rule of synergyRulesRaw) {
        if (rule.appliesTo.subclassId === s.id && checkAll(norm, rule.allOf)) score += rule.bonus;
      }
      for (const rule of penaltyRulesRaw) {
        if (rule.appliesTo.subclassId === s.id) {
          const hit = (rule.allOf ? checkAll(norm, rule.allOf) : false)
            || (rule.anyOf ? rule.anyOf.some(g => checkAll(norm, g.allOf)) : false);
          if (hit) score -= rule.penalty;
        }
      }
      return { ...s, score };
    })
    .sort((a, b) => b.score - a.score)[0] ?? null;

  // Best subclass for shadow class
  const shadowSub = subclassesRaw
    .filter(s => s.classId === shadowClass.id)
    .map(s => ({ ...s, score: dotScore(norm, s.weights as Partial<Scores>) }))
    .sort((a, b) => b.score - a.score)[0] ?? null;

  // Best race
  const topRace = racesRaw
    .map(r => ({ ...r, score: dotScore(norm, r.weights as Partial<Scores>) }))
    .sort((a, b) => b.score - a.score)[0];

  // Best archetype
  const topArchetype = archetypesRaw
    .map(a => ({ ...a, score: dotScore(norm, a.weights as Partial<Scores>) }))
    .sort((a, b) => b.score - a.score)[0];

  // Top 6 traits by normalized score
  const topTraits = ALL_TRAITS
    .map(t => ({ key: t, label: TRAIT_LABELS[t], pct: norm[t] }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 6);

  // Alignment
  const lawChaos = norm.order >= norm.chaos ? "Lawful" : "Chaotic";
  const goodEvil  = norm.mercy  > norm.ruthlessness + 15
    ? "Good"
    : norm.ruthlessness > norm.mercy + 15
    ? "Evil"
    : "Neutral";

  // Power source
  const affinities: TraitKey[] = [
    "arcane_affinity", "divine_affinity", "primal_affinity",
    "shadow_affinity", "martial_affinity",
  ];
  const topAffinity = affinities.reduce((best, t) => norm[t] > norm[best] ? t : best);
  const affinityLine: Record<TraitKey, string> = {
    arcane_affinity:   "You shape the world through arcane study or innate magical force.",
    divine_affinity:   "A divine or sacred purpose flows through your every action.",
    primal_affinity:   "You draw on the raw power of nature, instinct, and the wild.",
    shadow_affinity:   "Your strength comes from forbidden, cursed, or outsider energy.",
    martial_affinity:  "Steel, sinew, and trained will — you are the weapon.",
  } as Record<TraitKey, string>;

  const flavorLines = [
    `Alignment: ${lawChaos} ${goodEvil} — ${
      norm.order >= norm.chaos
        ? "Structure and principle anchor your choices."
        : "You trust your gut over any rulebook."
    }`,
    `Power Source: ${affinityLine[topAffinity] ?? "Your power defies easy categorization."}`,
    `Combat Role: ${
      norm.frontline > norm.backline
        ? "You press into danger, absorbing and dealing punishment up close."
        : "You prefer distance — orchestrating the fight from calculated positions."
    }`,
    `Social Mode: ${
      norm.leadership + norm.spotlight > norm.subtlety + norm.solitude
        ? "You command attention. Others naturally look to you."
        : "You operate in the margins, unseen until the moment matters."
    }`,
    `Decision-Making: ${
      norm.logic > norm.instinct
        ? "Calculation and foresight drive your choices."
        : "You trust the surge of instinct over careful analysis."
    }`,
  ];

  return {
    className:         topClass.label,
    subclassName:      bestSub?.label ?? "",
    classDesc:         topClass.description,
    raceName:          topRace.label,
    topTraits,
    archetypeLabel:    topArchetype.label,
    archetypeDesc:     topArchetype.description,
    lawChaos,
    goodEvil,
    shadowClassName:    shadowClass.label,
    shadowSubclassName: shadowSub?.label ?? "",
    shadowClassDesc:    shadowClass.description,
    flavorLines,
  };
}
