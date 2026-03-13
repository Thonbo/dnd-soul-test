# D&D 5e Personality Test - Starter JSON Pack v3

This package is a starter data model for a binary-answer D&D 5e personality test that maps a user into a fitting:

- race
- class
- subclass
- role
- playstyle
- fantasy identity

The system scores **hidden traits first** and only then resolves the build. It is designed to feel simple in the UI and complex in the backend.

## What changed in v3

- Expanded `questions.json` from **200 to 400 questions**
- Balanced the bank to **80 questions per category**
- Reworked `randomizationConfig.json` so the test can support a **dynamic question count**, not just fixed presets
- Added `questionEngineConfig.json` to define both:
  - **fixed target mode** for any chosen question count
  - **adaptive confidence mode** for variable-length sessions
- Added `questionBankStats.json` for quick inspection of category balance and trait exposure

## Included files

- `traits.json`
  - 30 hidden scoring traits
- `questions.json`
  - 400 binary questions
  - 80 per category: identity, power, combat, social, aesthetic
- `archetypes.json`
  - 12 macro-archetypes
- `classes.json`
  - 12 main 5e classes as weighted trait vectors
- `subclasses.json`
  - 24 subclasses as class modifiers
- `races.json`
  - 12 race flavor profiles
- `synergyRules.json`
  - coherence bonuses for especially fitting builds
- `penaltyRules.json`
  - contradiction handling so false-positive matches lose score
- `randomizationConfig.json`
  - dynamic count allocation, coverage rules, and adaptive stop logic
- `questionEngineConfig.json`
  - runtime behavior for fixed and adaptive modes
- `questionBankStats.json`
  - summary of pool balance and trait touch counts

## Core model

The system should not score classes directly from answers.

It should follow this flow:

1. Ask binary questions
2. Build a hidden user trait vector
3. Normalize scores
4. Detect macro-archetype
5. Score class candidates
6. Score subclass candidates
7. Score race flavor fit
8. Apply synergy bonuses
9. Apply contradiction penalties
10. Return the best builds with explanations

## Hidden trait categories

### 1) Personality traits
- order
- chaos
- duty
- freedom
- logic
- instinct
- mercy
- ruthlessness
- honor
- pragmatism

### 2) Social / identity traits
- leadership
- solitude
- spotlight
- subtlety
- outsider
- nobility

### 3) Power source affinity
- martial_affinity
- arcane_affinity
- divine_affinity
- primal_affinity
- shadow_affinity
- trickster_affinity

### 4) Playstyle traits
- frontline
- backline
- control
- destruction
- support
- mobility
- resilience
- complexity

## Question categories

The 400-question bank is spread across five buckets:

- `identity`
- `power`
- `combat`
- `social`
- `aesthetic`

That gives you enough volume for replayability while keeping any single session balanced.

## Why a 400-question bank matters

A larger bank gives you:

- replayability
- less memorization and answer-gaming
- stronger room for tuning weak questions later
- better support for different session lengths
- more reliable adaptive follow-up questioning

## Dynamic question counts

v3 is no longer limited to a few hard-coded presets.

The test can now support:

- **fixed target mode**
  - example: 24, 37, 50, 63, 100 questions
- **adaptive confidence mode**
  - the engine keeps asking until confidence is high enough, then stops

### Recommended practical range
- **24 to 120** questions for real product use

### Absolute supported range
- **5 to 400** questions

The lower end is technically possible, but not psychologically stable enough for strong results. For a real result page, stay at 24+.

## How dynamic allocation works

Instead of only storing presets like 30 / 50 / 75, the system now derives category quotas from weights.

### Category weights
Each category is set to:
- 20% identity
- 20% power
- 20% combat
- 20% social
- 20% aesthetic

### Quota method
The engine uses a proportional allocator:

1. multiply `targetQuestionCount` by each category weight
2. floor the results
3. distribute remaining slots by fractional remainder
4. rotate tie-breaking by seed so the same categories are not always favored

That means counts like 17, 24, 37, 63, or 112 can all be handled cleanly.

## Two session modes

### 1) Fixed target mode
Use this when the product or user chooses the exact number of questions.

Example:
- short session: 24
- standard session: 50
- long session: 75
- deep session: 100+

Flow:
1. resolve the target count
2. allocate quotas dynamically
3. sample a balanced question set
4. validate trait coverage
5. reshuffle and present

### 2) Adaptive confidence mode
Use this when you want the test to stop when the result becomes strong enough.

Flow:
1. ask a broad balanced core set first
2. score provisional results every few questions
3. detect uncertainty
4. ask targeted follow-up questions
5. stop once confidence and stability thresholds are met

This is the stronger product behavior if you want a smarter-feeling test.

## Core phase vs refinement phase

The system uses two conceptual phases.

### Core phase
Goal:
- build a broad psychological and playstyle signature

It should cover:
- personality oppositions
- social identity
- power source
- combat style

### Refinement phase
Goal:
- split close class candidates
- split subclass candidates
- refine race flavor

Example:
- Sorcerer vs Warlock
- Paladin vs Cleric
- Wizard vs Arcane Trickster
- Devotion vs Vengeance

## Coverage validation

Dynamic counts only work well if the selected session still covers the trait space.

That is why `randomizationConfig.json` includes coverage rules.

### Current coverage ideas
- target a minimum number of distinct traits touched
- require enough touches across major trait groups
- detect overrepresented traits
- allow a small swap pass to rebalance the selected session

This is how the engine avoids weird cases like:
- too many combat questions
- too much divine or shadow flavor
- not enough social identity signal
- not enough opposed-trait tension

## Adaptive stopping logic

Adaptive mode should not stop just because one build is temporarily ahead.

It should stop when the result is **stable**.

Suggested stop signals:
- the top build has a healthy score margin
- the trait profile is not moving much anymore
- key opposed trait pairs have enough signal
- subclass ambiguity is low enough

Suggested uncertainty signals:
- top two builds too close
- major trait pairs remain unresolved
- one cluster is under-sampled
- the winning class is clear but the subclass is not

## Question selection notes

The current bank is category-tagged.

That is enough for an MVP dynamic selector.

Later you can make the engine stronger by adding optional metadata fields like:
- `similarityGroup`
- `primaryTraits`
- `difficulty`
- `followUpFor`
- `antiBiasTag`

Those are not required yet, but the new config files already leave room for them.

## Scoring philosophy

### Class profiles
Each class in `classes.json` is a weighted trait vector.

Examples:
- Wizard is high in `logic`, `arcane_affinity`, `control`, `complexity`
- Paladin is high in `duty`, `honor`, `divine_affinity`, `support`, `frontline`
- Rogue is high in `subtlety`, `mobility`, `trickster_affinity`, `pragmatism`

### Subclass profiles
Subclasses modify a class. They do not replace the class.

### Race profiles
Races act as flavor-fit layers. They refine the answer rather than dominate it.

## Recommended scoring pipeline

### Step 1 - accumulate raw trait scores
Each answer adds the selected option's trait weights.

### Step 2 - normalize
A clean normalized range makes the rule system easier.

Recommended range:
- 0 to 100 per trait

### Step 3 - detect macro-archetype
Compare the normalized user vector to `archetypes.json`.

### Step 4 - score classes
Compare the user vector against each class profile.

Simple weighted dot product:
`sum(userTrait[t] * classWeight[t] * traitImportance[t])`

### Step 5 - score subclasses
Take the top class matches and apply subclass modifiers.

### Step 6 - score races
Apply race flavor fit to the leading build candidates.

### Step 7 - apply rules
Use:
- `synergyRules.json`
- `penaltyRules.json`

## Why synergy rules matter

Sometimes the profile is not just a class fit, but a very specific subclass fantasy.

Example:
- high arcane_affinity
- high destruction
- medium/high chaos
- high spotlight

That can indicate Storm Sorcerer or Wild Magic Sorcerer rather than generic Sorcerer.

## Why contradiction penalties matter

A profile can superficially match a class while clashing with its core identity.

Example:
A Devotion Paladin should probably not win if the user has:
- very low duty
- very low honor
- very high freedom
- very high pragmatism

## Suggested frontend behavior

### UI
Keep it very simple:
- one binary question at a time
- left option / right option
- progress indicator
- subtle D&D flavor
- no cluttered fantasy game HUD

### Progress copy
Because count can now be dynamic, the UI should support both:
- **fixed mode:** `Question 18 of 50`
- **adaptive mode:** `Question 26` + optional `Refining your build`

That makes adaptive mode feel intentional rather than broken.

## Suggested result structure

Return:
1. core match
2. shadow match
3. safe gameplay alternative

Explain:
- top traits
- why the class fits
- why the subclass fits
- why similar classes lost
- what playstyle the result implies

## Practical implementation note

If you want a fast MVP:

1. use fixed target mode first
2. support any target count through `randomizationConfig.json`
3. add coverage validation
4. add adaptive mode second

That gives you a solid launch path without overbuilding the first version.
