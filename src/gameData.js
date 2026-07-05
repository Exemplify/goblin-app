// All content from the "Goblin With a Fat Ass" rulebook (Tom Bloom, 2023).

export const ASS_SIZE_LABELS = {
  0: 'Shame to goblinkind',
  1: 'Firm handful',
  2: 'Bubble butt',
  3: 'Thick stack of pancakes',
  4: 'Green dump truck',
  5: 'The juggernaut',
  6: 'The terminator',
  7: 'Oh no',
};

export const ASS_SIZE_MIN = 0;
export const ASS_SIZE_MAX = 7;

export const ORIGINS = [
  { id: 1, name: 'A life of leisure and indolence', skills: ['charisma', 'fashion', 'wine tasting'] },
  { id: 2, name: 'Long years in the goblin wars', skills: ['stabbing', 'biting', 'spitting'] },
  { id: 3, name: 'Accident at wizard summer camp', skills: ['detect magic', 'use magic device'] },
  { id: 4, name: 'Worked hard for it', skills: ['weight lifting', 'climbing', 'calisthenics'] },
  { id: 5, name: 'Blessed by an enthusiastic nymph', skills: ['nature', 'alchemy', 'skinny dipping'] },
  { id: 6, name: 'Big natural', skills: [], pickTwo: true },
];

export const CLASSES = [
  {
    id: 1, name: 'Fighter', skills: ['fighting', 'stunt work'],
    ability: 'Roll ass to instantly disarm an opponent or violently smash a non-reinforced object or door into pieces.',
  },
  {
    id: 2, name: 'Thief', skills: ['lock picking', 'sneaking', 'pulling a fast one'],
    ability: "Roll ass to instantly steal any loose object not held or worn in hand's reach (doesn't work on other thieves).",
  },
  {
    id: 3, name: 'Barbarian', skills: ['intimidation', 'athletics', 'competitive eating'],
    ability: 'No penalty for dazed. May ignore being knocked out once.',
  },
  {
    id: 4, name: 'Wizard', skills: ['knowledge (goblin magic)', 'dewey decimal system'],
    ability: 'May roll ass to light most anything on fire.',
  },
  {
    id: 5, name: 'Priest', skills: ['knowledge (goblin religion)', 'gardening', 'trading cards'],
    ability: 'May pray to a goblin deity to make a re-roll of all dice (take second result as final) for anyone, may re-roll after seeing the final result. This always works twice. The third time or more, the deity may demand a price.',
  },
  {
    id: 6, name: 'Bard', skills: ['performance', 'alcohol tolerance', 'making playlists'],
    ability: 'May roll ass to perform with their instrument of choice (or a speech) and convincingly distract a small or large group of people or creatures for 1 minute, plus an additional minute per 6 rolled. Only works once on the same group.',
  },
  {
    id: 7, name: 'Warlock', skills: ['knowledge (goblin occult)', 'candles'],
    ability: 'May curse someone and roll ass to take them out non-lethally, instantly. They have to be able to hear you. They recover after 1 minute and it only works on the same person once.',
  },
  {
    id: 8, name: 'Paladin', skills: ['knowledge (non-goblin religion)', 'armor care', 'baking'],
    ability: 'May always choose to count own ass size as 1 when rolling.',
  },
];

export const POCKETS = [
  { id: 1, contents: 'Fabulous hat, stethoscope, tape, screwdriver, bottle of orc liquor (antiseptic, possibly drinkable)' },
  { id: 2, contents: 'The greatest perfectly shaped smooth and shiny stone you have ever seen' },
  { id: 3, contents: 'Various meat pies, pocket contents of a guard, knife, knife (bigger), ten foot of rope' },
  { id: 4, contents: 'Telescope (stolen), strong acid, four glass vials, unexploded artillery shell' },
  { id: 5, contents: 'Oddly sized key, bottle of oil (flammable), jar of ball bearings' },
  { id: 6, contents: 'Three different pairs of shoes, sunglasses, overcoat, loose sandwich, matches' },
];

// Skill pool for "Big natural" (pick two from the origins or the classes)
export const SKILL_POOL = [
  ...new Set([
    ...ORIGINS.filter((o) => !o.pickTwo).flatMap((o) => o.skills),
    ...CLASSES.flatMap((c) => c.skills),
  ]),
];

// Invented flavour (not from the rulebook): name parts, freely editable.
export const NAME_FRONTS = ['Snib', 'Grub', 'Pogg', 'Skiv', 'Mudge', 'Fizz', 'Lump', 'Sneck', 'Twitch', 'Nub', 'Krig', 'Boggle', 'Wretch', 'Gnash', 'Splat', 'Dreg'];
export const NAME_BACKS = ['wort', 'snout', 'gristle', 'nubbin', 'pockets', 'teeth', 'shanks', 'gob', 'bottom', 'cheeks', 'wiggle', 'noggin', 'fingers', 'guts', 'britches', 'rumble'];

// ---------------------------------------------------------------------------
// Rules reference (searchable). Text follows the rulebook.
// ---------------------------------------------------------------------------
export const REFERENCE = [
  {
    title: 'Playing the game',
    tags: 'basics overview dm disaster master',
    body: `You need 2–4 players and a disaster master (DM) who could also be a player. The DM describes a scene, plays the NPCs, and asks the players what they will do. The players get up to various forms of goblin mischief and the DM describes the outcomes based on their actions. To do anything, do it.`,
  },
  {
    title: 'Action rolls',
    tags: 'dice roll success fail hard 4+ 6',
    body: `Don't roll dice for everything! However, if it's contested or the outcome is unclear, roll 1d6: on a 4+ you do it; on 1–3 you don't and suffer the consequences. If doing it would be hard, you need to roll a 6 to do it and avoid consequences. What is hard or not is up to the DM but should be fairly obvious.`,
  },
  {
    title: 'Modifiers (more or less dice)',
    tags: 'skill advantage dazed bad situation 0 dice modifiers',
    body: `Roll 1 extra die if you have a skill. Roll 1 extra die if you have a situational advantage, like a tool or a convenient chandelier. Roll 1 less if you're dazed. Roll 1 less if the situation is bad — like you can't see, or you're suspended over a lake of lava by one hand. If any roll is reduced to 0 dice, roll 2d6 and pick the lowest.`,
  },
  {
    title: 'Risky rolls and the Ass Roll',
    tags: 'ass roll risky upside downside 6 1 cancel',
    body: `If doing something is risky (which should be most things) or could cause mayhem, mischief, or general chaos, you also roll ass. To roll ass, roll 1d6 per your goblin's ass size (2d6 pick lowest for 0 ass). If you get at least one 6 there's a surprising upside, opportunity, or advantage — multiple 6s mean this is extra good. This applies even if you fail. If you roll at least one 1 there's also a downside, extra risk, complication, or injury — multiple 1s mean this is extra bad. This applies even if you succeed. These may or may not be ass related. 1s and 6s cancel each other out.`,
  },
  {
    title: 'The chaos clock',
    tags: 'chaos clock midnight segments shit hits the fan',
    body: `Each time players roll at least one 1 on any final result of any ass roll, fill in one segment of the 12-segment chaos clock. This tracks generally how things are going. If the clock hits midnight and you run out of segments, shit hits the fan: you have to cut and run, or try and make a mad dash last bid for the prize. No exceptions! Please respect the chaos clock. (In this app, the clock lives with the DM — the roller just reminds you to report your 1s.)`,
  },
  {
    title: 'Consequences',
    tags: 'consequences fail cost smack ticking clock escalate',
    body: `Oh no! Someone failed a roll, or rolled some 1s on an ass roll. The DM does one or more of the following. Pay a cost: in attention (a goblin is preoccupied for a while), effectiveness (needs a little extra help from someone else to get the job done), or danger (the situation gets more dangerous or tense). OR smack someone: daze a goblin or knock a goblin out. OR start a ticking clock: write something bad down (the lava gets released, the dogs are loosed, the alarm is set off, the door jams) — the next time there's a fuckup in the same situation it comes true, or maybe the next time after that. OR escalate the situation (choose or roll 1d6): 1. guards are alerted or start catching up; 2. light something on fire; 3. something that wasn't supposed to break breaks; 4. drop or lose track of something important; 5. something goes wildly out of control; 6. someone gets split from the group (guards, convenient hatch, slide).`,
  },
  {
    title: 'Dazed & knocked out',
    tags: 'dazed knocked out status recover',
    body: `Dazed: a dazed goblin gets -1d6 to do anything, and if hurt again is knocked out. Goblins recover from being dazed after a scene is over. Knocked out: a knocked out goblin must be carried around like a sack of pear-shaped potatoes and wakes up in the next scene as long as they make it out OK — they are captured if left behind. It's pretty easy for a human of average strength to knock a goblin out with a big enough implement.`,
  },
  {
    title: 'Ass sizes',
    tags: 'ass size table character creation',
    body: `Roll 1d6 for ass size (1–6); you may adjust up or down 1 after rolling. This determines how many dice you roll when rolling ass. 0: shame to goblinkind. 1: firm handful. 2: bubble butt. 3: thick stack of pancakes. 4: green dump truck. 5: the juggernaut. 6: the terminator. 7: oh no.`,
  },
  {
    title: 'Origins — how did you get your ass?',
    tags: 'origin skills character creation',
    body: `Roll 1d6; determines skills. If you have a skill, roll an extra d6 when rolling. 1. A life of leisure and indolence — charisma, fashion, wine tasting. 2. Long years in the goblin wars — stabbing, biting, spitting. 3. Accident at wizard summer camp — detect magic, use magic device. 4. Worked hard for it — weight lifting, climbing, calisthenics. 5. Blessed by an enthusiastic nymph — nature, alchemy, skinny dipping. 6. Big natural — pick two of your choice from the above or the classes.`,
  },
  ...CLASSES.map((c) => ({
    title: `Class: ${c.name}`,
    tags: `class ability skills ${c.name.toLowerCase()}`,
    body: `Skills: ${c.skills.join(', ')}. Ability: ${c.ability} (If it's an active ability, just roll ass — you are always successful. Abilities fully refresh each mission.)`,
  })),
  {
    title: 'Pocket contents',
    tags: 'pockets items inventory character creation',
    body: `Roll 1d6, lasts per mission. ${POCKETS.map((p) => `${p.id}. ${p.contents}`).join(' ')}`,
  },
  {
    title: 'The secret',
    tags: 'kobold secret',
    body: `If you like, roll 1d6 — if you roll a 1, you are actually a kobold instead. (Don't tell the goblins.)`,
  },
  {
    title: 'Mission tables (for the DM)',
    tags: 'dm mission rich person location loot guards vault',
    body: `The rich person in question (1d6): 1. The mayor. 2. War criminal (retired). 3. Butter baron. 4. Fireworks factory magnate. 5. Exotic/mythical animal menagerie owner. 6. Sweatshop fashion icon. — The location: 1. Gala of the decade at the mayor's mansion. 2. Private fortified train. 3. Crumbling castle residence (rented). 4. Secret underwater base. 5. Ancient volcano temple. 6. Luxurious mansion on the edge of a cliff. — What are we robbing? 1. Big honking gold bars (heavy). 2. Imprisoned greed demon (loud, complains). 3. The world's most expensive dog. 4. Recipe for the secret sauce (kept in 300lb safe). 5. Hand of King Midas (still works!). 6. Potion of eternal youth (drinkable by two goblins or one human). — Protected by numerous but poorly paid guards and: 1. Bloodthirsty goblin-hating pirate mercenaries. 2. Merciless automata programmed to kill goblins on sight. 3. Vicious anti-goblin attack wyverns. 4. Dwarves (just really hate goblins). 5. A crack anti-goblin assault squad with cool call signs. 6. Bound goblin-destroying shadow demons (it's in the contract). — And locked in: 1. A glass room suspended over a lake (of lava?). 2. A clockwork vault that changes shape every hour. 3. An enormous quantum vault connected by a series of portals. 4. A living vault embedded in a huge beast. 5. The torment nexus. 6. A case that explodes if it feels the touch of a goblin for more than five seconds.`,
  },
];
