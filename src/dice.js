// Pure dice logic — no UI, no state. Kept separate so it can be unit-tested.

export function d6() {
  return Math.floor(Math.random() * 6) + 1;
}

export function d8() {
  return Math.floor(Math.random() * 8) + 1;
}

/**
 * Action roll. Base 1d6, +1 die per positive modifier, -1 per negative.
 * With multiple dice you take the highest. If reduced to 0 or fewer dice,
 * roll 2d6 and take the LOWEST.
 * Success: 4+ (or 6 if hard).
 */
export function actionRoll({ hard = false, skill = false, advantage = false, dazed = false, badSituation = false } = {}) {
  const net = 1 + (skill ? 1 : 0) + (advantage ? 1 : 0) - (dazed ? 1 : 0) - (badSituation ? 1 : 0);
  const zeroDice = net <= 0;
  let dice, result;
  if (zeroDice) {
    dice = [d6(), d6()];
    result = Math.min(...dice);
  } else {
    dice = Array.from({ length: net }, d6);
    result = Math.max(...dice);
  }
  const target = hard ? 6 : 4;
  return { dice, result, target, success: result >= target, zeroDice, net };
}

/**
 * Ass roll. 1d6 per point of ass size; at 0 ass, roll 2d6 and the final
 * result is the single lowest die. 6s = upside, 1s = downside, cancelling
 * pairwise. A net 1 remaining means the chaos clock fills a segment.
 */
export function assRoll(assSize) {
  const zeroAss = assSize <= 0;
  let rolled, finalDice;
  if (zeroAss) {
    rolled = [d6(), d6()];
    finalDice = [Math.min(...rolled)];
  } else {
    rolled = Array.from({ length: assSize }, d6);
    finalDice = rolled;
  }
  const sixes = finalDice.filter((v) => v === 6).length;
  const ones = finalDice.filter((v) => v === 1).length;
  const cancelled = Math.min(sixes, ones);
  const netSixes = sixes - cancelled;
  const netOnes = ones - cancelled;
  return {
    rolled,
    finalDice,
    sixes,
    ones,
    cancelled,
    netSixes,
    netOnes,
    chaos: netOnes > 0, // remind player: DM fills one chaos clock segment
    zeroAss,
  };
}
