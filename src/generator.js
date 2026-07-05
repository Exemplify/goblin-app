import { d6, d8 } from './dice.js';
import { ORIGINS, SKILL_POOL, NAME_FRONTS, NAME_BACKS, ASS_SIZE_MIN, ASS_SIZE_MAX } from './gameData.js';

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// crypto.randomUUID needs a secure context; fall back for http-over-LAN testing
const makeId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'g-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);

export function rollName() {
  return pick(NAME_FRONTS) + pick(NAME_BACKS);
}

export function rollAssSize() {
  return d6(); // 1-6; the ±1 adjust is surfaced in the UI afterwards
}

export function rollOriginId() {
  return d6();
}

/** Skills granted by an origin; "Big natural" picks two random from the pool. */
export function rollOriginSkills(originId) {
  const origin = ORIGINS.find((o) => o.id === originId);
  if (!origin) return [];
  if (origin.pickTwo) {
    const shuffled = [...SKILL_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }
  return [...origin.skills];
}

export function rollClassId() {
  return d8();
}

export function rollPocketId() {
  return d6();
}

/** 1-in-6: you are secretly a kobold. */
export function rollKobold() {
  return d6() === 1;
}

export function clampAssSize(n) {
  return Math.max(ASS_SIZE_MIN, Math.min(ASS_SIZE_MAX, n));
}

export function generateGoblin() {
  const originId = rollOriginId();
  return {
    id: makeId(),
    name: rollName(),
    assSize: rollAssSize(),
    originId,
    originSkills: rollOriginSkills(originId),
    classId: rollClassId(),
    pocketId: rollPocketId(),
    status: 'fine', // 'fine' | 'dazed' | 'knockedOut'
    isKobold: rollKobold(),
    secretRevealed: false,
    createdAt: Date.now(),
  };
}
