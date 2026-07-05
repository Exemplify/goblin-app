import { defineStore } from 'pinia';
import { generateGoblin, rollAssSize, rollOriginId, rollOriginSkills, rollClassId, rollPocketId, rollKobold, rollName, clampAssSize } from './generator.js';
import { ORIGINS, CLASSES, POCKETS, ASS_SIZE_LABELS } from './gameData.js';

const STORAGE_KEY = 'gwafa-state-v1';

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (Array.isArray(s.goblins)) {
        return { goblins: s.goblins, activeGoblinId: s.activeGoblinId ?? null };
      }
    }
  } catch (e) {
    console.warn('Could not load saved state', e);
  }
  return { goblins: [], activeGoblinId: null };
}

export const useStore = defineStore('gwafa', {
  state: () => ({
    ...loadPersisted(),
    view: 'goblins', // 'goblins' | 'sheet' | 'roller' | 'reference' (not persisted meaningfully, but harmless)
  }),

  getters: {
    activeGoblin(state) {
      return state.goblins.find((g) => g.id === state.activeGoblinId) ?? null;
    },
  },

  actions: {
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ goblins: this.goblins, activeGoblinId: this.activeGoblinId })
      );
    },

    go(view) {
      this.view = view;
    },

    newGoblin() {
      const g = generateGoblin();
      this.goblins.push(g);
      this.activeGoblinId = g.id;
      this.persist();
      this.view = 'sheet';
      return g;
    },

    setActive(id) {
      this.activeGoblinId = id;
      this.persist();
    },

    deleteGoblin(id) {
      this.goblins = this.goblins.filter((g) => g.id !== id);
      if (this.activeGoblinId === id) {
        this.activeGoblinId = this.goblins[0]?.id ?? null;
      }
      this.persist();
    },

    update(id, patch) {
      const g = this.goblins.find((x) => x.id === id);
      if (g) {
        Object.assign(g, patch);
        this.persist();
      }
    },

    // --- per-field rerolls / edits ---
    rerollName(id) { this.update(id, { name: rollName() }); },
    rerollAssSize(id) { this.update(id, { assSize: rollAssSize() }); },
    adjustAssSize(id, delta) {
      const g = this.goblins.find((x) => x.id === id);
      if (g) this.update(id, { assSize: clampAssSize(g.assSize + delta) });
    },
    rerollOrigin(id) {
      const originId = rollOriginId();
      this.update(id, { originId, originSkills: rollOriginSkills(originId) });
    },
    setOrigin(id, originId) {
      this.update(id, { originId, originSkills: rollOriginSkills(originId) });
    },
    rerollOriginSkills(id) {
      const g = this.goblins.find((x) => x.id === id);
      if (g) this.update(id, { originSkills: rollOriginSkills(g.originId) });
    },
    rerollClass(id) { this.update(id, { classId: rollClassId() }); },
    rerollPockets(id) { this.update(id, { pocketId: rollPocketId() }); },
    rerollSecret(id) { this.update(id, { isKobold: rollKobold(), secretRevealed: false }); },
  },
});

// --- display helpers ---
export function originOf(goblin) {
  return ORIGINS.find((o) => o.id === goblin.originId) ?? ORIGINS[0];
}
export function classOf(goblin) {
  return CLASSES.find((c) => c.id === goblin.classId) ?? CLASSES[0];
}
export function pocketsOf(goblin) {
  return POCKETS.find((p) => p.id === goblin.pocketId) ?? POCKETS[0];
}
export function assLabel(size) {
  return ASS_SIZE_LABELS[size] ?? '???';
}
export const STATUS_LABELS = { fine: 'Fine', dazed: 'Dazed', knockedOut: 'Knocked out' };
