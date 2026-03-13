# D&D 5e Personality Test - Starter JSON Pack

This package contains a production-minded starter data model for a binary-answer D&D 5e personality test.

The intent is:
- simple UI on the surface
- deep scoring under the hood
- believable character outputs
- less cliché than direct “magic = wizard” logic

## Included files

- `traits.json`
  - the 30 hidden scoring traits
  - grouped into personality, social/identity, power source, and playstyle
- `questions.json`
  - 50 binary questions
  - each option affects multiple hidden traits
- `archetypes.json`
  - 12 macro-archetypes used as an intermediate interpretation layer
- `classes.json`
  - 12 main 5e classes as weighted trait vectors
- `subclasses.json`
  - 24 subclasses as modifiers on top of the base class profiles
- `races.json`
  - 12 race flavor profiles
  - races are meant to refine the result, not dominate it
- `synergyRules.json`
  - extra bonuses for especially coherent combinations
- `penaltyRules.json`
  - contradiction handling so the engine avoids shallow mismatches

## Core model

The system should not score classes directly from answers.

Instead, it should follow this flow:

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

## Why this structure matters

A good D&D personality engine needs to separate four things that are often mixed together:

- **who the user is**
- **what fantasy identity they are drawn to**
- **how they want to play**
- **what aesthetic flavor feels like “them”**

Without that separation, the quiz becomes too shallow.

## Question design principles

Each binary question should:
- feel equally attractive on both sides
- avoid obvious moral bias
- avoid obvious class bias
- affect 3 to 6 hidden traits
- measure something deeper than “sword vs magic”

The UI can remain minimal:
- one centered question card
- two answer buttons
- progress bar
- optional category label
- subtle D&D theming

## Scoring philosophy

### Class profiles
Each class in `classes.json` is a weighted trait vector.

Example:
- Wizard is high in `logic`, `arcane_affinity`, `control`, `complexity`
- Paladin is high in `duty`, `honor`, `divine_affinity`, `support`, `frontline`
- Rogue is high in `subtlety`, `mobility`, `trickster_affinity`, `pragmatism`

### Subclass profiles
Subclasses should modify a class, not replace it.

Example:
- Sorcerer gives innate arcane power
- Wild Magic Sorcerer adds chaos
- Draconic Bloodline adds destruction, durability, and a more regal flavor

### Race profiles
Races should act like flavor-fit layers, not the main identity engine.

Example:
- Tiefling sharpens outsider / shadow / charisma flavor
- Dwarf sharpens resilience / duty
- Aasimar sharpens divine / noble energy

## Recommended scoring pipeline

### Step 1 - accumulate raw trait scores
Each answer adds the selected option’s trait weights.

### Step 2 - normalize
A clean normalized range makes the rule system easier.

Recommended range:
- 0 to 100 per trait

One practical normalization approach:
- track min possible and max possible for each trait across all questions
- convert the user raw score into a normalized percentile for that trait

### Step 3 - detect macro-archetype
Compare the normalized user vector to `archetypes.json`.

This gives a thematic identity layer such as:
- Guardian
- Scholar
- Storm
- Trickster
- Outsider Mage
- Beast

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

These two files are what stop the engine from being dumb.

## Why synergy rules matter

Sometimes a user profile is not just a class match but a very coherent subclass fantasy.

Example:
- high arcane_affinity
- high destruction
- medium/high chaos
- high spotlight

That is more than “Sorcerer”.
That starts to look specifically like a Storm/Wild/Draconic Sorcerer profile.

Synergy rules reward those patterns.

## Why contradiction penalties matter

A user can superficially match a class while deeply clashing with its core fantasy.

Example:
A Devotion Paladin should probably not win if the user has:
- very low duty
- very low honor
- extremely high ruthlessness
- very low mercy

Penalty rules prevent these false positives.

## Recommended weighting

A practical build formula:

`finalBuildScore = classFit * 0.45 + subclassFit * 0.25 + playstyleFit * 0.15 + raceFlavorFit * 0.10 + synergyBonus * 0.05 - contradictionPenalty`

You can tune these weights later.

## Recommended output format

Return 3 results, not 1.

### 1. Core Match
The psychologically strongest fit

### 2. Shadow Match
A darker, stranger, more chaotic variant of the same person

### 3. Safe Gameplay Alternative
A similar identity with easier or more reliable table execution

This makes the quiz feel more human and less rigid.

## Result explanation model

Do not only output:
- race
- class
- subclass

Also explain:
- top 5 defining traits
- main archetype
- why this beat the nearest competing result
- which contradictions were avoided
- playstyle summary
- flavor summary

## Suggested front-end UX

Use a premium, restrained fantasy style:
- dark parchment / obsidian tones
- serif display type
- readable sans-serif body
- muted gold / iron / crimson accents
- minimal iconography only

Avoid:
- overly gamey fantasy clutter
- cheap tavern UI styling
- obvious “good vs evil” framing

## Suggested implementation notes

You can model the data layer with:
- `Question`
- `AnswerOption`
- `Trait`
- `ArchetypeProfile`
- `ClassProfile`
- `SubclassProfile`
- `RaceProfile`
- `SynergyRule`
- `PenaltyRule`

Recommended folder layout:

```txt
/data
  traits.json
  questions.json
  archetypes.json
  classes.json
  subclasses.json
  races.json
  synergyRules.json
  penaltyRules.json
```

## Tuning advice

Do not launch with every official 5e option.

This starter pack is intentionally scoped:
- 12 classes
- 24 subclasses
- 12 races
- 50 questions
- 12 archetypes

That is enough to feel deep while still being tunable.

## Best next steps

1. Build the scoring function
2. Build the normalization function
3. Add result explanation templates
4. Create the UI shell
5. Test with 20–30 people
6. Adjust question weights
7. Tune contradiction and synergy rules

## Notes on extension

When you expand the system, add:
- more subclasses before more classes
- more races only as flavor layers
- advanced mode questions later
- optional build preference questions after the personality section

A strong rule:
- **personality first**
- **playstyle second**
- **flavor third**

That makes the final build feel like the user “to the core”.

