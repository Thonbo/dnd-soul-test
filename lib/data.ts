export type Scores = {
  str: number; dex: number; int: number; wis: number; cha: number; con: number;
  martial: number; magic: number;
  arcane: number; divine: number; primal: number; pact: number;
  tank: number; striker: number; support: number; controller: number;
  stealth: number; social: number; exploration: number;
  order: number; chaos: number; good: number; dark: number;
  simple: number; complex: number;
  nova: number; sustained: number;
  melee: number; ranged: number;
};

export const ZERO: Scores = {
  str:0,dex:0,int:0,wis:0,cha:0,con:0,
  martial:0,magic:0,arcane:0,divine:0,primal:0,pact:0,
  tank:0,striker:0,support:0,controller:0,
  stealth:0,social:0,exploration:0,
  order:0,chaos:0,good:0,dark:0,
  simple:0,complex:0,nova:0,sustained:0,
  melee:0,ranged:0,
};

export type Choice = { label: string; weights: Partial<Scores> };
export type Question = { text: string; a: Choice; b: Choice };

export const QUESTIONS: Question[] = [
  {
    text: "A stranger picks a fight in a tavern. Before a word is spoken, your body has already...",
    a: { label: "...stepped forward, hand on hilt — plant yourself between them and yours.", weights: {str:2,con:2,tank:2,melee:1,order:1,good:1} },
    b: { label: "...shifted your weight back, scanning for exits and counting allies.", weights: {dex:2,int:2,stealth:1,chaos:1,controller:1} },
  },
  {
    text: "Power, in its purest form, is...",
    a: { label: "The force of your own body — muscle, endurance, trained beyond breaking.", weights: {str:2,con:2,martial:2,melee:1,simple:1} },
    b: { label: "The mastery of forces the body alone could never contain.", weights: {magic:2,int:1,wis:1,complex:1,ranged:1} },
  },
  {
    text: "You acquire that power through...",
    a: { label: "Discipline and relentless repetition. No shortcut, no inheritance.", weights: {order:2,martial:2,sustained:1,simple:1,str:1} },
    b: { label: "A moment of revelation, a pact struck in darkness, or blood that runs strange.", weights: {chaos:1,magic:2,pact:1,arcane:1,nova:1} },
  },
  {
    text: "Magic flows through you. It feels like...",
    a: { label: "A precisely shaped lattice of theory and willpower — yours to command.", weights: {arcane:2,int:3,complex:2,controller:1} },
    b: { label: "A wild, inherited current — something born into the bone.", weights: {arcane:1,cha:2,nova:2,simple:1,striker:1} },
  },
  {
    text: "The gods of this world are...",
    a: { label: "Worthy of devotion. Their purpose gives my power meaning.", weights: {divine:3,wis:2,order:2,good:1} },
    b: { label: "Forces to negotiate with, outwit, or simply ignore.", weights: {chaos:1,pact:1,dark:1,cha:1,int:1} },
  },
  {
    text: "Deep in an ancient forest, far from any road, you feel...",
    a: { label: "At home. Nature is honest in ways civilization never manages.", weights: {primal:2,wis:2,exploration:2,chaos:1,dex:1} },
    b: { label: "Alert — danger lurks, and you intend to overcome it.", weights: {martial:1,striker:1,str:1,con:1,int:1} },
  },
  {
    text: "A dignitary insults your party publicly before a full court. You...",
    a: { label: "Step forward and dismantle their argument with charm and carefully chosen words.", weights: {cha:3,social:3,int:1} },
    b: { label: "Note the insult, say nothing, and ensure they regret it later.", weights: {int:2,stealth:1,wis:2,dark:1} },
  },
  {
    text: "Your allies are surrounded and outnumbered. You...",
    a: { label: "Put yourself at the center and refuse to let anything past you.", weights: {tank:3,con:2,str:1,good:2,order:1} },
    b: { label: "Shatter the enemy's formation from range before they can close.", weights: {ranged:2,controller:2,striker:1,int:1,dex:1} },
  },
  {
    text: "The ideal way to end a fight is...",
    a: { label: "A single, perfect strike — precise, devastating, and done.", weights: {dex:2,striker:3,nova:2,stealth:1} },
    b: { label: "Outlasting everything — you are simply still standing when it ends.", weights: {con:2,str:1,sustained:2,tank:2,martial:1} },
  },
  {
    text: "Between battles, your time belongs to...",
    a: { label: "Training, drilling, sharpening the edge.", weights: {martial:2,order:1,str:1,dex:1,con:1,simple:1} },
    b: { label: "Reading, theorizing, refining a craft most cannot comprehend.", weights: {int:2,complex:2,magic:1,wis:1,arcane:1} },
  },
  {
    text: "Your armor philosophy is...",
    a: { label: "Heavy plate — let them hit you. You will endure.", weights: {tank:3,con:2,str:1,melee:1,order:1} },
    b: { label: "Nothing that slows you down. Speed and evasion are your defense.", weights: {dex:3,stealth:1,striker:1,chaos:1,ranged:1} },
  },
  {
    text: "A captured enemy begs for mercy. You...",
    a: { label: "Grant it — death is a last resort, and justice requires witness.", weights: {order:2,good:2,support:1,divine:1} },
    b: { label: "Hesitate, then decide based on what they know or what they cost you.", weights: {int:2,chaos:1,dark:1,wis:1} },
  },
  {
    text: "Your relationship with death is...",
    a: { label: "Sacred — I have walked its edge, and I carry that weight with purpose.", weights: {divine:2,wis:2,good:1,order:1} },
    b: { label: "A tool — to be wielded, delayed, or turned back on those who brought it.", weights: {dark:2,pact:1,chaos:1,int:1} },
  },
  {
    text: "When your allies are injured in combat, your first instinct is...",
    a: { label: "Get to them. Keep them standing. That is the whole job.", weights: {support:3,divine:1,primal:1,wis:2,good:2} },
    b: { label: "Kill the thing that hurt them — the fastest cure is ending the fight.", weights: {striker:2,martial:1,str:1,dex:1,nova:1} },
  },
  {
    text: "The wild world of nature speaks to you...",
    a: { label: "Deeply. I hear its rhythms and move within them.", weights: {primal:3,wis:2,dex:1,exploration:1,chaos:1} },
    b: { label: "Not especially. I am a creature of streets, courts, and schemes.", weights: {social:1,cha:1,int:1,order:1} },
  },
  {
    text: "Facing overwhelming odds, you...",
    a: { label: "Enter a battle-fury — let instinct and violence carry you through.", weights: {str:2,con:2,martial:1,chaos:2,nova:2} },
    b: { label: "Assess, adapt, and find the elegant solution no one else saw.", weights: {int:2,wis:1,complex:2,controller:1,order:1} },
  },
  {
    text: "A city's ruling class is corrupt. You would...",
    a: { label: "Work within the system — earn trust and dismantle it from inside.", weights: {social:2,cha:2,order:2,good:1,int:1} },
    b: { label: "Tear the whole rotten structure down and build something real.", weights: {chaos:2,dark:1,str:1,striker:1,primal:1} },
  },
  {
    text: "In a dungeon, you are drawn toward...",
    a: { label: "Secret passages, hidden doors, and ancient script on the walls.", weights: {exploration:2,int:1,wis:1,dex:1,stealth:1} },
    b: { label: "The main chamber where the greatest threat waits.", weights: {striker:2,str:1,melee:1,nova:1,chaos:1} },
  },
  {
    text: "Close combat vs. range — your honest preference is...",
    a: { label: "Close the distance and decide it there, face to face.", weights: {melee:2,str:1,con:1,tank:1,martial:1} },
    b: { label: "Distance is control — I dictate the terms from where they cannot easily reach.", weights: {ranged:2,dex:1,int:1,controller:1,complex:1} },
  },
  {
    text: "Your bond to your power feels...",
    a: { label: "Earned through sacrifice, faith, and an oath I have not broken.", weights: {divine:3,wis:1,cha:1,good:2,order:2} },
    b: { label: "Like a bargain struck in a language most people would not survive hearing.", weights: {pact:3,cha:2,dark:2,chaos:1,magic:1} },
  },
  {
    text: "When you enter a room full of strangers, you...",
    a: { label: "Read the room — threat assessment, exits, who matters and who doesn't.", weights: {int:2,dex:1,stealth:1,wis:1,complex:1} },
    b: { label: "Own it. You become the most interesting person there without trying.", weights: {cha:2,social:2,striker:1,chaos:1} },
  },
  {
    text: "The battlefield role that defines you is...",
    a: { label: "The unmovable wall — I hold the line so others can act.", weights: {tank:3,con:2,str:1,order:1,sustained:1} },
    b: { label: "The unexpected variable — I arrive where they are most vulnerable.", weights: {controller:2,striker:1,dex:1,chaos:1,stealth:1} },
  },
  {
    text: "Your hands are instruments of...",
    a: { label: "Craft and invention — you can build what others only dream of.", weights: {int:2,complex:2,support:1,exploration:1,wis:1} },
    b: { label: "Decisive, concentrated force.", weights: {str:1,dex:1,striker:2,martial:2,nova:1} },
  },
  {
    text: "In your heart, you pursue...",
    a: { label: "Meaning — a cause, a calling, a reason that makes the cost worthwhile.", weights: {divine:1,good:2,order:1,support:1,wis:1} },
    b: { label: "Mastery — to be the finest in the world at exactly what you do.", weights: {complex:1,striker:1,martial:1,int:1,dex:1} },
  },
  {
    text: "Your most dangerous quality is...",
    a: { label: "Your refusal to yield — you will break before you bend.", weights: {con:2,tank:1,str:1,order:1,good:1,sustained:1} },
    b: { label: "Your unpredictability — no one has ever correctly guessed your next move.", weights: {chaos:2,dex:1,stealth:1,int:1,controller:1} },
  },
  {
    text: "When you are truly angry, you...",
    a: { label: "Go cold. The anger becomes fuel, precision, and patience.", weights: {order:2,int:1,wis:1,striker:1,sustained:1} },
    b: { label: "Become something terrifying. The leash comes off.", weights: {chaos:2,str:2,con:1,nova:2,dark:1} },
  },
  {
    text: "If you wield magic, it draws from...",
    a: { label: "Nature — the living world, the turning seasons, the ancient pulse.", weights: {primal:2,wis:2,exploration:1,chaos:1,dex:1} },
    b: { label: "Something far older and stranger than nature — or nothing arcane at all.", weights: {arcane:1,pact:1,int:1,dark:1,martial:1} },
  },
  {
    text: "The ideal adventuring party...",
    a: { label: "Has clear roles, a plan, and everyone trusts the plan.", weights: {order:2,support:1,wis:1,good:1,tank:1} },
    b: { label: "Has mavericks who improvise — chaos creates the opportunities the plan never could.", weights: {chaos:2,cha:1,dex:1,striker:1,nova:1} },
  },
  {
    text: "If you could be invisible for one day, you would...",
    a: { label: "Infiltrate somewhere critical and learn what powerful people hide.", weights: {stealth:2,int:2,dex:1,dark:1,exploration:1} },
    b: { label: "Follow someone who needs protecting, unseen.", weights: {support:2,good:2,wis:1,divine:1,tank:1} },
  },
  {
    text: "A powerful artifact offers ultimate strength — at a cost you cannot yet see. You...",
    a: { label: "Take it. Power without risk is not power — it is comfort.", weights: {dark:2,chaos:2,nova:2,pact:1,str:1} },
    b: { label: "Decline, or study it until you understand exactly what you're accepting.", weights: {order:2,good:1,int:2,wis:2,complex:1} },
  },
  {
    text: "The person who trained you was...",
    a: { label: "A rigid, demanding master who broke you and rebuilt you better.", weights: {order:2,martial:2,str:1,con:1,simple:1} },
    b: { label: "A cryptic mentor who showed you a door and made you open it yourself.", weights: {magic:1,complex:2,wis:2,int:1,exploration:1} },
  },
  {
    text: "If a bard were to write your saga, the title would be...",
    a: { label: "'The Shield That Never Broke' — endurance, sacrifice, and the people you protected.", weights: {tank:2,good:2,con:1,order:1,support:1,divine:1} },
    b: { label: "'The Storm That Had No Name' — singular, devastating, and leaving nothing the same.", weights: {striker:2,nova:2,chaos:2,dark:1,dex:1} },
  },
];

export type ClassDef = {
  name: string;
  sub: string;
  raceHint: string;
  score: (s: Scores) => number;
  stats: Record<string,number>;
  traits: string[];
  secondaryClass: string;
  secondarySub: string;
  secondaryNote: string;
};

export const CLASSES: ClassDef[] = [
  {
    name:"Barbarian", sub:"Path of the Berserker", raceHint:"Half-Orc",
    score:s=>s.str*1.5+s.con*1.5+s.martial+s.chaos*1.2+s.melee+s.nova*1.3,
    stats:{STR:17,CON:16,DEX:14,WIS:8,INT:8,CHA:10},
    traits:[
      "Rage burns hotter than reason — and that is your greatest weapon.",
      "You have survived things that would shatter a lesser soul. The scars prove it.",
      "Subtlety is someone else's problem. You are the solution to the wrong kind of problem.",
      "Every wound you take makes you angrier. Your enemies haven't understood what that means yet.",
    ],
    secondaryClass:"Fighter", secondarySub:"Champion",
    secondaryNote:"Champion's Improved Critical stacks with Brutal Critical — your crit fishing becomes genuinely monstrous.",
  },
  {
    name:"Fighter", sub:"Battle Master", raceHint:"Variant Human",
    score:s=>s.martial*1.8+s.str*0.8+s.dex*0.8+s.melee+s.order*0.8+s.sustained*1.2+s.con,
    stats:{STR:16,DEX:14,CON:15,INT:10,WIS:12,CHA:9},
    traits:[
      "You are the most dangerous human in the room — no shortcuts required.",
      "Every battle is a lesson. You have learned every lesson available.",
      "You do not rely on miracles, pacts, or destiny. You rely on training.",
      "Versatility is your edge — you can do anything a specialist can, precisely when it matters.",
    ],
    secondaryClass:"Rogue", secondarySub:"Arcane Trickster",
    secondaryNote:"Rogue 2 adds Cunning Action and Sneak Attack — your Action Surge turn becomes borderline illegal.",
  },
  {
    name:"Paladin", sub:"Oath of Vengeance", raceHint:"Aasimar",
    score:s=>s.divine*1.3+s.str*0.9+s.melee+s.good*1.2+s.order*1.1+s.cha*0.8+s.support*0.7+s.tank,
    stats:{STR:16,CHA:15,CON:14,WIS:10,DEX:8,INT:10},
    traits:[
      "Your power flows from conviction — unshakeable, burning, and absolute.",
      "You are sword and shield simultaneously. That is not a contradiction. That is a calling.",
      "The gods chose you. That is not a gift. It is a responsibility with an edge.",
      "Evil does not merely fail against you — it is judged by you, and found wanting.",
    ],
    secondaryClass:"Warlock", secondarySub:"Hexblade",
    secondaryNote:"Hexblade 1 gives CHA to attacks, a short-rest slot, and Hex — the classic Hexadin engine.",
  },
  {
    name:"Ranger", sub:"Gloom Stalker", raceHint:"Wood Elf",
    score:s=>s.dex*1.2+s.primal*0.9+s.exploration*1.3+s.ranged*1.1+s.striker*0.8+s.stealth*1.2+s.wis,
    stats:{DEX:16,WIS:14,CON:13,STR:11,INT:10,CHA:9},
    traits:[
      "You move between worlds — wild and civilized — belonging entirely to neither.",
      "You know the land. You know the enemy. You strike before they know you exist.",
      "Patient, precise, and entirely self-sufficient. You need no one — though you choose your companions.",
      "The wilderness is not hostile. It simply tests the worthy, and discards the rest.",
    ],
    secondaryClass:"Rogue", secondarySub:"Assassin",
    secondaryNote:"Assassin's guaranteed crits on surprised enemies stack lethally with Gloom Stalker's first-round burst.",
  },
  {
    name:"Rogue", sub:"Assassin", raceHint:"Tabaxi",
    score:s=>s.dex*1.5+s.stealth*1.5+s.chaos*0.9+s.striker*1.1+s.int*0.6+s.nova*0.8,
    stats:{DEX:17,INT:14,CHA:12,WIS:11,CON:10,STR:8},
    traits:[
      "You never fight fair. That is not cowardice — that is intelligence.",
      "Information is the deadliest weapon you own, and you have a lot of it.",
      "You have been underestimated your entire life. You have made your peace with that.",
      "One perfect strike, landed at the right moment, ends more fights than a dozen desperate swings.",
    ],
    secondaryClass:"Fighter", secondarySub:"Battle Master",
    secondaryNote:"Fighter 3 gives Action Surge — double sneak attacks in one turn. The math is as cruel as it sounds.",
  },
  {
    name:"Monk", sub:"Way of Shadow", raceHint:"Githyanki",
    score:s=>s.dex*1.3+s.wis*1.3+s.order*1.1+s.martial+s.melee*0.9+s.stealth*0.8+s.sustained,
    stats:{DEX:16,WIS:15,CON:13,STR:11,INT:10,CHA:8},
    traits:[
      "Your body is a weapon honed over years of absolute, uncompromising discipline.",
      "You require nothing — no armor, no sword, no spell. Only yourself.",
      "Mind and body are indistinguishable. Your enemies see only a blur.",
      "When violence comes from you, it is precise, purposeful, and over before they can react.",
    ],
    secondaryClass:"Rogue", secondarySub:"Kensei",
    secondaryNote:"Rogue 2 provides Cunning Action, letting your Monk dart in, strike, and vanish every single turn.",
  },
  {
    name:"Wizard", sub:"School of Chronurgy", raceHint:"High Elf",
    score:s=>s.arcane*1.1+s.int*2.2+s.complex*1.2+s.magic*0.9+s.ranged+s.controller*1.1,
    stats:{INT:17,DEX:14,CON:13,WIS:12,CHA:10,STR:8},
    traits:[
      "You have read the universe's source code. Now you rewrite it.",
      "Others call it arrogance. You call it accuracy — you are simply correct more often than they are.",
      "Given sufficient preparation, there is no problem you cannot solve.",
      "Power is not something you were given. It was carved from decades of relentless study.",
    ],
    secondaryClass:"Fighter", secondarySub:"Eldritch Knight",
    secondaryNote:"War Caster + Fighter 2 gives Action Surge — your spell economy becomes genuinely brutal.",
  },
  {
    name:"Sorcerer", sub:"Draconic Bloodline", raceHint:"Dragonborn",
    score:s=>s.arcane*0.9+s.cha*2+s.magic*0.8+s.nova*1.5+s.simple*0.8+s.striker*1.1,
    stats:{CHA:17,CON:14,DEX:13,INT:10,WIS:10,STR:8},
    traits:[
      "Magic does not answer to you — it IS you. The distinction is academic.",
      "Where others cast spells, you exhale fire. Where others study, you simply remember.",
      "Your power was not learned. It was always there, waiting to be released.",
      "Metamagic is the art of turning a powerful spell into a statement the world cannot unhear.",
    ],
    secondaryClass:"Paladin", secondarySub:"Oath of the Open Sea",
    secondaryNote:"Paladin 6 for Aura of Protection turns your CHA score into a party-wide defensive engine.",
  },
  {
    name:"Warlock", sub:"The Hexblade", raceHint:"Tiefling",
    score:s=>s.pact*1.8+s.cha*1.3+s.dark*1.5+s.chaos*0.9+s.magic*0.8+s.striker+s.nova,
    stats:{CHA:17,CON:14,DEX:12,INT:11,WIS:10,STR:8},
    traits:[
      "You made a deal. You have no regrets — only debts, and a very long memory.",
      "Your power is borrowed. What you do with it is entirely, irrevocably your own.",
      "You see what others cannot, know what others cannot, survive what others cannot.",
      "Between you and your patron, it is not entirely clear who serves whom.",
    ],
    secondaryClass:"Paladin", secondarySub:"Oath of Vengeance",
    secondaryNote:"Hexadin — stacks CHA to attacks, saving throws, and short-rest slot economy. Effortlessly dominant.",
  },
  {
    name:"Bard", sub:"College of Lore", raceHint:"Half-Elf",
    score:s=>s.cha*1.9+s.social*1.6+s.support*0.9+s.int*0.7+s.controller*0.8+s.chaos*0.6,
    stats:{CHA:17,DEX:14,INT:13,CON:12,WIS:10,STR:8},
    traits:[
      "You know a little about everything — and that makes you more dangerous than most specialists.",
      "Your words can start wars, end them, or make everyone forget they were fighting.",
      "You are not a support character. You are a walking phenomenon who occasionally helps people.",
      "Every secret you learn is another string to pluck when precisely the right moment arrives.",
    ],
    secondaryClass:"Sorcerer", secondarySub:"Divine Soul",
    secondaryNote:"Divine Soul 1 unlocks the full Cleric list and Favored by the Gods — enormous versatility gain.",
  },
  {
    name:"Cleric", sub:"War Domain", raceHint:"Aasimar",
    score:s=>s.divine*1.8+s.wis*1.5+s.support*1.2+s.order*0.9+s.good*1.1+s.melee*0.7,
    stats:{WIS:16,CON:14,STR:13,CHA:12,DEX:10,INT:9},
    traits:[
      "You are the gods' fist — and their mercy. These are not contradictions.",
      "No party survives without someone willing to stand between the wounded and the world.",
      "Your faith is not blind. It has been tested, shattered, and reforged stronger each time.",
      "The divine does not simply flow through you. It is expressed through every choice you make.",
    ],
    secondaryClass:"Paladin", secondarySub:"Oath of Glory",
    secondaryNote:"Cleric / Paladin splits divine resources across two full casting progressions — absurd support ceiling.",
  },
  {
    name:"Druid", sub:"Circle of the Moon", raceHint:"Tortle",
    score:s=>s.primal*2+s.wis*1.4+s.exploration*0.9+s.controller*0.8+s.support*0.7+s.chaos*0.5,
    stats:{WIS:17,CON:14,DEX:12,INT:11,CHA:9,STR:8},
    traits:[
      "You do not cast spells. You remind the world of what it already is.",
      "You have worn shapes that would shatter a lesser mind's sense of self.",
      "Civilization is a brief, fragile invention. The wild is eternal.",
      "You do not fight nature. You ARE nature — and nature is neither gentle nor forgiving.",
    ],
    secondaryClass:"Ranger", secondarySub:"Beast Master",
    secondaryNote:"Ranger 5 gives Extra Attack in beast form — stacking absurdly with Moon Druid's Wild Shape HP.",
  },
  {
    name:"Artificer", sub:"Artillerist", raceHint:"Rock Gnome",
    score:s=>s.int*2+s.complex*1.5+s.support*0.8+s.ranged*0.8+s.magic*0.5+s.martial*0.4+s.wis*0.3,
    stats:{INT:17,CON:13,DEX:13,WIS:12,CHA:9,STR:8},
    traits:[
      "Magic is just technology that hasn't been properly documented yet.",
      "You approach every problem as an engineering challenge — and you always find a solution.",
      "Your creations outlast your enemies. Sometimes they outlast your allies.",
      "The battlefield is not chaos to you. It is a system to be analyzed and optimized.",
    ],
    secondaryClass:"Wizard", secondarySub:"Bladesinger",
    secondaryNote:"Wizard 2 for Bladesong + War Caster is an insane AC floor and concentration-save ceiling.",
  },
  {
    name:"Blood Hunter", sub:"Order of the Profane Soul", raceHint:"Half-Orc",
    score:s=>s.dark*1.8+s.martial+s.int*0.8+s.str*0.8+s.melee+s.striker*1.1+s.con*0.8+s.chaos*0.5,
    stats:{STR:15,INT:14,CON:14,DEX:12,WIS:11,CHA:9},
    traits:[
      "You have bled for your power — literally. There is no refund, and you asked for none.",
      "You walk the line between monster and mortal, and you chose this side deliberately.",
      "The things that prey on humanity? You hunt them. With their own weapons.",
      "Pain is not a consequence of your power. It is the cost, paid willingly, every single time.",
    ],
    secondaryClass:"Ranger", secondarySub:"Monster Slayer",
    secondaryNote:"Monster Slayer 3 adds Hunter's Sense and Slayer's Prey — mechanically and thematically perfect.",
  },
];

export type RaceDef = { name: string; score: (s: Scores) => number };
export const RACES: RaceDef[] = [
  {name:"Mountain Dwarf",    score:s=>s.con+s.tank+s.order+s.str+s.martial},
  {name:"High Elf",          score:s=>s.arcane+s.int+s.dex+s.magic+s.complex},
  {name:"Wood Elf",          score:s=>s.primal+s.dex+s.exploration+s.wis+s.stealth},
  {name:"Drow",              score:s=>s.dark+s.dex+s.cha+s.stealth+s.pact},
  {name:"Lightfoot Halfling",score:s=>s.dex+s.stealth+s.cha+s.social+s.chaos},
  {name:"Rock Gnome",        score:s=>s.int+s.complex+s.arcane+s.support},
  {name:"Half-Orc",          score:s=>s.str+s.con+s.striker+s.martial+s.chaos+s.nova},
  {name:"Tiefling",          score:s=>s.dark+s.cha+s.pact+s.arcane+s.chaos},
  {name:"Dragonborn",        score:s=>s.str+s.cha+s.nova+s.martial+s.melee},
  {name:"Half-Elf",          score:s=>s.cha+s.social+s.support+s.good+s.complex},
  {name:"Aasimar",           score:s=>s.divine+s.cha+s.good+s.support+s.order},
  {name:"Variant Human",     score:s=>s.complex+s.order+s.sustained+s.martial+s.int},
  {name:"Tabaxi",            score:s=>s.dex+s.exploration+s.stealth+s.chaos+s.striker},
  {name:"Goliath",           score:s=>s.str+s.con+s.tank+s.melee+s.sustained},
  {name:"Warforged",         score:s=>s.tank+s.martial+s.con+s.order+s.sustained},
  {name:"Githyanki",         score:s=>s.int+s.str+s.martial+s.arcane+s.complex},
  {name:"Tortle",            score:s=>s.con+s.wis+s.primal+s.tank+s.order},
  {name:"Yuan-ti Pureblood", score:s=>s.dark+s.int+s.cha+s.magic+s.pact},
];

export const ARCHETYPES: Record<string, string[]> = {
  "Barbarian":    ["The Unbreakable","The Berserker Without Chains","The Living Calamity"],
  "Fighter":      ["The Veteran of a Hundred Campaigns","The Tactical Blade","The Last Soldier Standing"],
  "Paladin":      ["The Crusader Reborn","The Oathsworn Avenger","The Divine Warlord"],
  "Ranger":       ["The Ghost of the Wilds","The Inevitable Hunter","The Wandering Blade"],
  "Rogue":        ["The Ghost in the Machine","The Unseen Hand","The One Who Was Never There"],
  "Monk":         ["The Fist of the Mountain","The Serene Destroyer","The Empty Vessel"],
  "Wizard":       ["The Living Spellbook","The Architect of Reality","The Scholar of Ends"],
  "Sorcerer":     ["The Bloodline Unleashed","The Storm Made Flesh","The Wild Miracle"],
  "Warlock":      ["The Indebted Iconoclast","The Voice from the Void","The Patron's Deepest Regret"],
  "Bard":         ["The Beautiful Catastrophe","The Keeper of All Secrets","The Melody of Ruin"],
  "Cleric":       ["The Hand of Divine Wrath","The Shepherd and the Blade","The Saint Who Bleeds"],
  "Druid":        ["The Verdant Fury","The Primordial Shape","The Last Remnant of the Old World"],
  "Artificer":    ["The Constructor of Impossible Things","The Weaponized Mind","The Walking Siege Engine"],
  "Blood Hunter": ["The Monster Who Hunts Monsters","The Cursed Crusader","The Blood-Price Paid"],
};
