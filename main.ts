// One Emoji, One Dream Vacation — make.fun bounty entry
//
// Deterministic selector: scores a small shortlist of candidate emoji
// against the five published judging criteria (most important first),
// then writes exactly one emoji — the winner — to /output/entry.txt.
//
// Criteria (weights reflect the published priority order):
//   1. Clearly a dream vacation at a glance (weight 3.0)
//   2. Evokes the trip like a postcard, vivid at a glance (weight 2.5)
//   3. Personal and specific, not a generic holiday (weight 2.0)
//   4. A spark of wit / surprise, a fresh choice (weight 1.5)
//   5. Instantly readable across cultures and screens, clear small (weight 1.0)
//
// Every candidate is a single Unicode code point (no variation selector,
// no ZWJ sequence), so the output file holds exactly one emoji.

import { mkdirSync, writeFileSync } from "node:fs";

const OUTPUT_PATH = "/output/entry.txt";

interface Candidate {
  emoji: string;
  name: string;
  // Scores 0-10 for criteria 1..5, in priority order.
  scores: [number, number, number, number, number];
}

const WEIGHTS: [number, number, number, number, number] = [3.0, 2.5, 2.0, 1.5, 1.0];

const CANDIDATES: Candidate[] = [
  // A remote tropical island: the postcard image of "I need to get away".
  // Specific (an island escape, not just any beach), vivid, universally read.
  { emoji: "🏝", name: "desert island", scores: [10, 10, 9, 8, 10] },
  // Sunrise over the sea: beautiful, but a moment of the day, not a trip.
  { emoji: "🌅", name: "sunrise over water", scores: [7, 9, 6, 6, 9] },
  // Snow-capped mountain: a dream trip for some, but reads "cold / hiking"
  // as fast as it reads "vacation", and less postcard-warm.
  { emoji: "🏔", name: "snow-capped mountain", scores: [7, 8, 8, 6, 9] },
  // Airplane departure: the journey, not the destination; generic transit.
  { emoji: "🛫", name: "airplane departure", scores: [6, 6, 4, 5, 10] },
  // Beach with umbrella: the most generic holiday image there is.
  { emoji: "🏖", name: "beach with umbrella", scores: [9, 8, 4, 3, 10] },
  // Cruise ship: specific and fun, but reads "cruise" more than "dream".
  { emoji: "🛳", name: "passenger ship", scores: [7, 7, 7, 6, 8] },
  // Surfer: personal and specific, but niche — not everyone's dream trip.
  { emoji: "🏄", name: "person surfing", scores: [6, 8, 8, 7, 7] },
  // Volcano: striking and surprising, but reads "danger / geology" first.
  { emoji: "🌋", name: "volcano", scores: [4, 7, 8, 8, 9] },
  // Camping in the woods: a real trip, but "roughing it", not a dream escape.
  { emoji: "🏕", name: "camping", scores: [6, 7, 7, 5, 9] },
  // Mount Fuji: iconic and specific, but one place — and reads as Japan
  // first, vacation second, for a judge scanning fast.
  { emoji: "🗻", name: "mount Fuji", scores: [6, 8, 9, 7, 9] },
];

function weightedScore(c: Candidate): number {
  return c.scores.reduce((sum, s, i) => sum + s * WEIGHTS[i], 0);
}

function main(): void {
  const ranked = CANDIDATES.map((c) => ({
    ...c,
    total: weightedScore(c),
  })).sort((a, b) => b.total - a.total);

  console.log("Candidate scores (weighted total / 100):");
  for (const c of ranked) {
    console.log(`  ${c.emoji} ${c.name.padEnd(22)} ${c.total.toFixed(1)}`);
  }

  const winner = ranked[0];
  console.log(`\nWinner: ${winner.emoji} ${winner.name} (${winner.total.toFixed(1)})`);

  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, winner.emoji, "utf8");
  console.log(`Wrote ${OUTPUT_PATH}`);
}

main();
