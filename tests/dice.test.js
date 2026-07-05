// Quick sanity tests for dice logic. Run: node tests/dice.test.js
import { actionRoll, assRoll } from '../src/dice.js';

let failures = 0;
const check = (name, cond) => {
  if (!cond) { failures++; console.error('FAIL:', name); }
  else console.log('ok:', name);
};

// --- action roll dice counts ---
{
  let ok = true;
  for (let i = 0; i < 500; i++) {
    if (actionRoll({}).dice.length !== 1) ok = false;
  }
  check('base roll is 1 die', ok);
}
{
  const r = actionRoll({ skill: true, advantage: true });
  check('skill+advantage = 3 dice', r.dice.length === 3);
  check('result is highest', r.result === Math.max(...r.dice));
}
{
  const r = actionRoll({ dazed: true });
  check('dazed only → 0 dice → 2d6', r.zeroDice && r.dice.length === 2);
  check('zero-dice result is lowest', r.result === Math.min(...r.dice));
}
{
  const r = actionRoll({ dazed: true, badSituation: true });
  check('-2 net → still 2d6 lowest', r.zeroDice && r.result === Math.min(...r.dice));
}
{
  const r = actionRoll({ hard: true, skill: true });
  check('hard target is 6', r.target === 6 && r.success === (r.result === 6));
}
{
  let ok = true;
  for (let i = 0; i < 2000; i++) {
    const r = actionRoll({});
    if (r.success !== (r.result >= 4)) ok = false;
    if (r.result < 1 || r.result > 6) ok = false;
  }
  check('normal target 4+, values 1-6', ok);
}

// --- ass roll ---
{
  const r = assRoll(4);
  check('ass 4 rolls 4 dice', r.finalDice.length === 4 && r.rolled.length === 4);
}
{
  const r = assRoll(0);
  check('ass 0 rolls 2, keeps lowest', r.rolled.length === 2 && r.finalDice.length === 1 && r.finalDice[0] === Math.min(...r.rolled));
}
{
  // statistical: cancellation math is internally consistent
  let ok = true;
  for (let i = 0; i < 5000; i++) {
    const r = assRoll(1 + Math.floor(Math.random() * 7));
    const sixes = r.finalDice.filter((v) => v === 6).length;
    const ones = r.finalDice.filter((v) => v === 1).length;
    if (r.cancelled !== Math.min(sixes, ones)) ok = false;
    if (r.netSixes !== sixes - r.cancelled || r.netOnes !== ones - r.cancelled) ok = false;
    if (r.netSixes > 0 && r.netOnes > 0) ok = false; // can't both remain
    if (r.chaos !== (r.netOnes > 0)) ok = false;
  }
  check('cancellation is pairwise and chaos flag matches net 1s', ok);
}
{
  // distribution sanity: over many rolls, some upsides and downsides occur
  let up = 0, down = 0;
  for (let i = 0; i < 3000; i++) {
    const r = assRoll(3);
    if (r.netSixes) up++;
    if (r.netOnes) down++;
  }
  check('upsides and downsides both occur at ass 3', up > 100 && down > 100);
}

console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
