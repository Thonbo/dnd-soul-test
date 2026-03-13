export type TraitKey =
  | 'order' | 'chaos' | 'duty' | 'freedom' | 'logic' | 'instinct'
  | 'mercy' | 'ruthlessness' | 'honor' | 'pragmatism'
  | 'leadership' | 'solitude' | 'spotlight' | 'subtlety' | 'outsider' | 'nobility'
  | 'martial_affinity' | 'arcane_affinity' | 'divine_affinity'
  | 'primal_affinity' | 'shadow_affinity' | 'trickster_affinity'
  | 'frontline' | 'backline' | 'control' | 'destruction'
  | 'support' | 'mobility' | 'resilience' | 'complexity';

export const ALL_TRAITS: TraitKey[] = [
  'order','chaos','duty','freedom','logic','instinct',
  'mercy','ruthlessness','honor','pragmatism',
  'leadership','solitude','spotlight','subtlety','outsider','nobility',
  'martial_affinity','arcane_affinity','divine_affinity',
  'primal_affinity','shadow_affinity','trickster_affinity',
  'frontline','backline','control','destruction',
  'support','mobility','resilience','complexity',
];

export type TraitVector = Partial<Record<TraitKey, number>>;
export type NormalizedVector = Record<TraitKey, number>;

export type AnswerOption = { label: string; weights: TraitVector };
export type Question = { id: string; category: string; text: string; optionA: AnswerOption; optionB: AnswerOption };
export type ClassDef   = { id: string; label: string; description: string; weights: TraitVector };
export type SubclassDef = { id: string; classId: string; label: string; description: string; weights: TraitVector };
export type ArchetypeDef = { id: string; label: string; description: string; weights: TraitVector };
export type RaceDef    = { id: string; label: string; description: string; weights: TraitVector };

export type SynergyCondition = { trait: TraitKey; operator: '>=' | '<' | '>'; value: number };
export type SynergyRule = {
  id: string; label: string;
  appliesTo: { classId: string; subclassId?: string };
  allOf: SynergyCondition[];
  bonus: number; reason: string;
};
export type PenaltyRule = {
  id: string; label: string;
  appliesTo: { classId: string; subclassId?: string };
  allOf?: SynergyCondition[];
  anyOf?: Array<{ allOf: SynergyCondition[] }>;
  penalty: number; reason: string;
};

export type BuildResult = {
  type: 'core' | 'shadow' | 'safe';
  archetype: ArchetypeDef;
  classDef: ClassDef;
  subclass: SubclassDef;
  race: RaceDef;
  score: number;
  topTraits: Array<{ key: TraitKey; value: number }>;
  synergies: string[];
  penalties: string[];
};

export type TestResult = {
  core: BuildResult;
  shadow: BuildResult;
  safe: BuildResult;
  normalized: NormalizedVector;
};
