<script setup>
import { ref, computed, watch } from 'vue';
import { useStore, classOf, assLabel } from '../store.js';
import { actionRoll, assRoll } from '../dice.js';
import Die from '../components/Die.vue';

const store = useStore();
const g = computed(() => store.activeGoblin);
const isBarbarian = computed(() => g.value && classOf(g.value).name === 'Barbarian');
const isPaladin = computed(() => g.value && classOf(g.value).name === 'Paladin');

// --- Action roll modifiers ---
const hard = ref(false);
const skill = ref(false);
const advantage = ref(false);
const dazed = ref(false);
const badSituation = ref(false);
const risky = ref(true); // most things are risky — ass roll rides along by default

// Dazed auto-suggest from character status (Barbarians ignore it)
watch(
  () => [g.value?.id, g.value?.status],
  () => { dazed.value = g.value?.status === 'dazed' && !isBarbarian.value; },
  { immediate: true }
);

const netDice = computed(
  () => 1 + (skill.value ? 1 : 0) + (advantage.value ? 1 : 0) - (dazed.value ? 1 : 0) - (badSituation.value ? 1 : 0)
);

// --- Ass size source ---
const paladinOne = ref(false);
const manualAss = ref(2); // fallback when no character exists
const assSize = computed(() => {
  if (paladinOne.value && isPaladin.value) return 1;
  return g.value ? g.value.assSize : manualAss.value;
});

// --- Results ---
const action = ref(null);
const ass = ref(null);
const rolledAt = ref(0); // forces re-animation

function doActionRoll() {
  action.value = actionRoll({
    hard: hard.value, skill: skill.value, advantage: advantage.value,
    dazed: dazed.value, badSituation: badSituation.value,
  });
  ass.value = risky.value ? assRoll(assSize.value) : null;
  rolledAt.value = Date.now();
}

function doAssOnly() {
  action.value = null;
  ass.value = assRoll(assSize.value);
  rolledAt.value = Date.now();
}

// Priest (or anyone the priest blesses): reroll everything, take second result
function reroll() {
  if (action.value) doActionRoll();
  else if (ass.value) doAssOnly();
}

// Tone for each final ass die, marking cancelled pairs
const assDiceTones = computed(() => {
  if (!ass.value) return [];
  let sixesToCancel = ass.value.cancelled;
  let onesToCancel = ass.value.cancelled;
  return ass.value.finalDice.map((v) => {
    if (v === 6) { if (sixesToCancel > 0) { sixesToCancel--; return 'cancelled'; } return 'good'; }
    if (v === 1) { if (onesToCancel > 0) { onesToCancel--; return 'cancelled'; } return 'bad'; }
    return 'default';
  });
});

const toggles = computed(() => [
  { model: hard, label: 'Hard (needs a 6)', sub: 'DM says it’s hard', kind: 'neutral' },
  { model: skill, label: '+1d6 Skill', sub: 'you have a relevant skill', kind: 'plus' },
  { model: advantage, label: '+1d6 Advantage', sub: 'tool, chandelier, etc.', kind: 'plus' },
  { model: dazed, label: '−1d6 Dazed', sub: isBarbarian.value ? 'Barbarian: no dazed penalty!' : 'you are dazed', kind: 'minus' },
  { model: badSituation, label: '−1d6 Bad situation', sub: 'can’t see, dangling over lava…', kind: 'minus' },
]);
</script>

<template>
  <div class="space-y-4">
    <!-- Who's rolling -->
    <div class="flex items-center justify-between bg-night-850 border border-swamp-900 rounded-2xl px-4 py-3">
      <div v-if="g" class="min-w-0">
        <div class="font-black text-swamp-100 truncate">{{ g.name }}</div>
        <div class="text-xs text-swamp-100/50">ass {{ g.assSize }} · “{{ assLabel(g.assSize) }}” · {{ classOf(g).name }}</div>
      </div>
      <div v-else class="min-w-0">
        <div class="font-black text-swamp-100">No goblin yet</div>
        <div class="text-xs text-swamp-100/50">using manual ass size below</div>
      </div>
      <button v-if="!g" @click="store.newGoblin()" class="text-sm font-bold text-swamp-300 bg-night-800 border border-swamp-800 rounded-xl px-3 py-2 active:scale-95 transition shrink-0">+ New</button>
    </div>

    <!-- ACTION ROLL -->
    <section class="rounded-2xl bg-night-850 border border-swamp-900 p-4 space-y-3">
      <h2 class="font-black text-swamp-200 text-lg">Action roll</h2>

      <div class="space-y-1.5">
        <button
          v-for="t in toggles"
          :key="t.label"
          @click="t.model.value = !t.model.value"
          class="w-full flex items-center justify-between rounded-xl border px-3.5 py-2.5 transition active:scale-[0.99] text-left"
          :class="t.model.value
            ? (t.kind === 'minus' ? 'bg-red-950/50 border-red-800' : t.kind === 'plus' ? 'bg-swamp-900 border-swamp-600' : 'bg-amber-950/50 border-amber-700')
            : 'bg-night-900 border-swamp-900/60'"
        >
          <div>
            <div class="font-bold text-sm" :class="t.model.value ? 'text-swamp-100' : 'text-swamp-100/60'">{{ t.label }}</div>
            <div class="text-[11px] text-swamp-100/40">{{ t.sub }}</div>
          </div>
          <div class="w-10 h-6 rounded-full p-0.5 transition shrink-0" :class="t.model.value ? 'bg-swamp-500' : 'bg-night-800 border border-swamp-900'">
            <div class="w-5 h-5 rounded-full bg-white transition" :class="t.model.value ? 'translate-x-4' : ''"></div>
          </div>
        </button>
      </div>

      <!-- Risky toggle -->
      <button
        @click="risky = !risky"
        class="w-full flex items-center justify-between rounded-xl border px-3.5 py-2.5 transition active:scale-[0.99] text-left"
        :class="risky ? 'bg-swamp-900 border-swamp-600' : 'bg-night-900 border-swamp-900/60'"
      >
        <div>
          <div class="font-bold text-sm" :class="risky ? 'text-swamp-100' : 'text-swamp-100/60'">🍑 Risky — roll ass too</div>
          <div class="text-[11px] text-swamp-100/40">most things are risky ({{ assSize }} ass {{ assSize === 1 ? 'die' : 'dice' }})</div>
        </div>
        <div class="w-10 h-6 rounded-full p-0.5 transition shrink-0" :class="risky ? 'bg-swamp-500' : 'bg-night-800 border border-swamp-900'">
          <div class="w-5 h-5 rounded-full bg-white transition" :class="risky ? 'translate-x-4' : ''"></div>
        </div>
      </button>

      <button
        @click="doActionRoll"
        class="w-full bg-swamp-600 hover:bg-swamp-500 text-white font-black text-lg rounded-2xl py-4 shadow-lg shadow-swamp-950 active:scale-[0.98] transition"
      >
        Roll {{ netDice <= 0 ? '2d6 (take lowest!)' : `${netDice}d6` }}{{ hard ? ' — need a 6' : '' }}
      </button>
    </section>

    <!-- ASS ROLL (standalone) -->
    <section class="rounded-2xl bg-night-850 border border-swamp-900 p-4 space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-black text-swamp-200 text-lg">Ass roll only</h2>
        <span class="text-xs text-swamp-100/40">for class abilities & pure chaos</span>
      </div>

      <div v-if="!g" class="flex items-center justify-between bg-night-900 rounded-xl px-3.5 py-2.5 border border-swamp-900/60">
        <span class="text-sm font-bold text-swamp-100/70">Manual ass size</span>
        <div class="flex items-center gap-2">
          <button @click="manualAss = Math.max(0, manualAss - 1)" class="w-9 h-9 rounded-lg bg-night-800 border border-swamp-800 font-black text-swamp-200 active:scale-90 transition">−</button>
          <span class="w-6 text-center font-black text-swamp-300 text-lg">{{ manualAss }}</span>
          <button @click="manualAss = Math.min(7, manualAss + 1)" class="w-9 h-9 rounded-lg bg-night-800 border border-swamp-800 font-black text-swamp-200 active:scale-90 transition">+</button>
        </div>
      </div>

      <button
        v-if="isPaladin"
        @click="paladinOne = !paladinOne"
        class="w-full flex items-center justify-between rounded-xl border px-3.5 py-2.5 transition active:scale-[0.99] text-left"
        :class="paladinOne ? 'bg-swamp-900 border-swamp-600' : 'bg-night-900 border-swamp-900/60'"
      >
        <div>
          <div class="font-bold text-sm" :class="paladinOne ? 'text-swamp-100' : 'text-swamp-100/60'">⚔️ Paladin: count ass as 1</div>
          <div class="text-[11px] text-swamp-100/40">your class ability, always allowed</div>
        </div>
        <div class="w-10 h-6 rounded-full p-0.5 transition shrink-0" :class="paladinOne ? 'bg-swamp-500' : 'bg-night-800 border border-swamp-900'">
          <div class="w-5 h-5 rounded-full bg-white transition" :class="paladinOne ? 'translate-x-4' : ''"></div>
        </div>
      </button>

      <button
        @click="doAssOnly"
        class="w-full bg-night-800 border-2 border-swamp-600 text-swamp-200 font-black text-lg rounded-2xl py-3.5 active:scale-[0.98] transition"
      >
        🍑 Roll ass ({{ assSize <= 0 ? '2d6, take lowest' : `${assSize}d6` }})
      </button>
    </section>

    <!-- RESULTS -->
    <section v-if="action || ass" :key="rolledAt" class="rounded-2xl bg-night-800 border-2 p-4 space-y-4"
      :class="action ? (action.success ? 'border-swamp-500' : 'border-red-700') : 'border-swamp-700'">

      <!-- Action result -->
      <div v-if="action">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] uppercase tracking-widest text-swamp-100/40 font-bold">
            Action — {{ action.zeroDice ? '0 dice → 2d6 take lowest' : `${action.net}d6 take highest` }}, need {{ action.target }}+
          </span>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <Die
            v-for="(v, i) in action.dice"
            :key="i"
            :value="v"
            :tone="v === action.result ? (action.success ? 'good' : 'bad') : 'dim'"
          />
          <div class="ml-auto text-right">
            <div class="text-3xl font-black leading-none" :class="action.success ? 'text-swamp-300' : 'text-red-400'">
              {{ action.success ? 'YOU DO IT' : 'NOPE' }}
            </div>
            <div class="text-xs text-swamp-100/50 mt-1">{{ action.success ? '' : 'suffer the consequences…' }}</div>
          </div>
        </div>
      </div>

      <!-- Ass result -->
      <div v-if="ass">
        <div class="text-[10px] uppercase tracking-widest text-swamp-100/40 font-bold mb-2">
          Ass roll — {{ ass.zeroAss ? '0 ass: 2d6, lowest counts' : `${ass.finalDice.length}d6` }}
        </div>
        <div v-if="ass.zeroAss" class="flex items-center gap-2 mb-1.5">
          <Die v-for="(v, i) in ass.rolled" :key="'r' + i" :value="v" :tone="v === ass.finalDice[0] ? 'default' : 'dim'" />
          <span class="text-xs text-swamp-100/40">→ lowest counts</span>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <Die v-for="(v, i) in ass.finalDice" :key="'f' + i" :value="v" :tone="assDiceTones[i]" />
        </div>

        <div class="mt-3 space-y-1.5">
          <p v-if="ass.cancelled" class="text-xs text-swamp-100/50">
            {{ ass.cancelled }} six{{ ass.cancelled > 1 ? 'es' : '' }} and {{ ass.cancelled }} one{{ ass.cancelled > 1 ? 's' : '' }} cancel out.
          </p>
          <div v-if="ass.netSixes" class="rounded-xl bg-swamp-900/70 border border-swamp-600 px-3 py-2 text-sm font-bold text-swamp-200">
            ✨ Upside{{ ass.netSixes > 1 ? ` ×${ass.netSixes} — extra good!` : '' }} — a surprising opportunity or advantage (even if you failed)
          </div>
          <div v-if="ass.netOnes" class="rounded-xl bg-red-950/70 border border-red-700 px-3 py-2 text-sm font-bold text-red-200">
            💥 Downside{{ ass.netOnes > 1 ? ` ×${ass.netOnes} — extra bad!` : '' }} — a complication, risk, or injury (even if you succeeded)
          </div>
          <div v-if="ass.chaos" class="rounded-xl bg-amber-950/80 border-2 border-amber-500 px-3 py-2.5 text-sm font-black text-amber-300">
            🕛 TELL THE DM: fill one chaos clock segment
          </div>
          <p v-if="!ass.netSixes && !ass.netOnes" class="text-sm text-swamp-100/60 font-semibold">
            Clean ass roll — no upside, no downside.
          </p>
        </div>
      </div>

      <button @click="reroll" class="text-xs text-swamp-100/40 underline underline-offset-2">
        🙏 reroll everything, take second result (Priest blessing — always works twice)
      </button>
    </section>
  </div>
</template>
