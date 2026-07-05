<script setup>
import { computed, ref } from 'vue';
import { useStore, originOf, classOf, pocketsOf, assLabel, STATUS_LABELS } from '../store.js';
import { ORIGINS, CLASSES, POCKETS, ASS_SIZE_MIN, ASS_SIZE_MAX } from '../gameData.js';

const store = useStore();
const g = computed(() => store.activeGoblin);
const editingName = ref(false);

const statuses = [
  { id: 'fine', label: 'Fine' },
  { id: 'dazed', label: 'Dazed' },
  { id: 'knockedOut', label: 'KO’d' },
];

function toggleSecret() {
  store.update(g.value.id, { secretRevealed: !g.value.secretRevealed });
}
</script>

<template>
  <!-- No character yet -->
  <div v-if="!g" class="text-center py-16 space-y-4">
    <div class="text-6xl">📜</div>
    <p class="text-swamp-100/70 px-6">No active goblin. Generate one and its sheet lives here.</p>
    <button
      @click="store.newGoblin()"
      class="bg-swamp-600 hover:bg-swamp-500 text-white font-bold rounded-xl px-5 py-3 active:scale-95 transition"
    >+ New Goblin</button>
  </div>

  <div v-else class="space-y-3">
    <!-- Name -->
    <div class="rounded-2xl bg-night-850 border border-swamp-900 p-4">
      <div class="flex items-center justify-between gap-2">
        <div class="min-w-0 flex-1">
          <div class="text-[10px] uppercase tracking-widest text-swamp-100/40 font-bold">Name</div>
          <input
            v-if="editingName"
            :value="g.name"
            @change="store.update(g.id, { name: $event.target.value }); editingName = false"
            @blur="editingName = false"
            class="bg-night-800 border border-swamp-700 rounded-lg px-2 py-1 mt-1 w-full text-lg font-black text-swamp-100 focus:outline-none focus:border-swamp-400"
            autofocus
          />
          <button v-else @click="editingName = true" class="text-2xl font-black text-swamp-100 truncate block text-left">
            {{ g.name }} <span class="text-xs text-swamp-100/30 font-normal">✎</span>
          </button>
        </div>
        <button @click="store.rerollName(g.id)" class="shrink-0 text-lg bg-night-800 border border-swamp-800 rounded-xl w-10 h-10 active:scale-90 transition" title="Reroll name">🎲</button>
      </div>

      <!-- Status -->
      <div class="mt-3">
        <div class="text-[10px] uppercase tracking-widest text-swamp-100/40 font-bold mb-1.5">Status <span class="normal-case font-normal">(set by what the DM tells you)</span></div>
        <div class="grid grid-cols-3 gap-1 bg-night-900 rounded-xl p-1">
          <button
            v-for="s in statuses"
            :key="s.id"
            @click="store.update(g.id, { status: s.id })"
            class="rounded-lg py-2 text-sm font-bold transition active:scale-95"
            :class="g.status === s.id
              ? (s.id === 'fine' ? 'bg-swamp-700 text-white' : s.id === 'dazed' ? 'bg-amber-700 text-white' : 'bg-red-800 text-white')
              : 'text-swamp-100/50'"
          >{{ s.label }}</button>
        </div>
        <p v-if="g.status === 'dazed'" class="text-xs text-amber-300/80 mt-1.5">
          Dazed: −1d6 to do anything; hurt again = knocked out. Recovers after the scene.
          <span v-if="classOf(g).name === 'Barbarian'" class="text-swamp-300 font-semibold">…but you're a Barbarian: no penalty for dazed!</span>
        </p>
        <p v-if="g.status === 'knockedOut'" class="text-xs text-red-300/80 mt-1.5">
          Knocked out: carried around like a sack of pear-shaped potatoes. Wakes next scene if carried out; captured if left behind.
        </p>
      </div>
    </div>

    <!-- Ass size -->
    <div class="rounded-2xl bg-night-850 border border-swamp-900 p-4">
      <div class="text-[10px] uppercase tracking-widest text-swamp-100/40 font-bold">Ass size</div>
      <div class="flex items-center justify-between mt-2">
        <div>
          <div class="text-5xl font-black text-swamp-300 leading-none">{{ g.assSize }}</div>
          <div class="text-sm text-swamp-100/70 mt-1 italic">“{{ assLabel(g.assSize) }}”</div>
        </div>
        <div class="flex items-center gap-1.5">
          <button @click="store.adjustAssSize(g.id, -1)" :disabled="g.assSize <= ASS_SIZE_MIN"
            class="w-11 h-11 rounded-xl bg-night-800 border border-swamp-800 text-xl font-black text-swamp-200 disabled:opacity-30 active:scale-90 transition">−</button>
          <button @click="store.adjustAssSize(g.id, +1)" :disabled="g.assSize >= ASS_SIZE_MAX"
            class="w-11 h-11 rounded-xl bg-night-800 border border-swamp-800 text-xl font-black text-swamp-200 disabled:opacity-30 active:scale-90 transition">+</button>
          <button @click="store.rerollAssSize(g.id)" class="w-11 h-11 rounded-xl bg-night-800 border border-swamp-800 text-lg active:scale-90 transition" title="Reroll ass size">🎲</button>
        </div>
      </div>
      <p class="text-xs text-swamp-100/40 mt-2">Rolled 1d6; the rules let you adjust ±1 after rolling. Sets your ass roll dice.</p>
    </div>

    <!-- Origin -->
    <div class="rounded-2xl bg-night-850 border border-swamp-900 p-4">
      <div class="flex items-center justify-between">
        <div class="text-[10px] uppercase tracking-widest text-swamp-100/40 font-bold">How did you get your ass?</div>
        <button @click="store.rerollOrigin(g.id)" class="shrink-0 text-lg bg-night-800 border border-swamp-800 rounded-xl w-10 h-10 active:scale-90 transition" title="Reroll origin">🎲</button>
      </div>
      <select
        :value="g.originId"
        @change="store.setOrigin(g.id, Number($event.target.value))"
        class="mt-2 w-full bg-night-800 border border-swamp-800 rounded-xl px-3 py-2.5 font-bold text-swamp-100 focus:outline-none focus:border-swamp-400"
      >
        <option v-for="o in ORIGINS" :key="o.id" :value="o.id">{{ o.id }}. {{ o.name }}</option>
      </select>
      <div class="mt-2.5 flex flex-wrap gap-1.5 items-center">
        <span v-for="s in g.originSkills" :key="s" class="bg-swamp-900 text-swamp-200 text-xs font-semibold rounded-full px-2.5 py-1">{{ s }}</span>
        <button
          v-if="originOf(g).pickTwo"
          @click="store.rerollOriginSkills(g.id)"
          class="text-xs text-swamp-400 font-bold underline underline-offset-2 active:opacity-60"
        >reroll picks</button>
      </div>
      <p class="text-xs text-swamp-100/40 mt-2">Each skill = +1d6 when it applies.</p>
    </div>

    <!-- Class -->
    <div class="rounded-2xl bg-night-850 border border-swamp-900 p-4">
      <div class="flex items-center justify-between">
        <div class="text-[10px] uppercase tracking-widest text-swamp-100/40 font-bold">Class</div>
        <button @click="store.rerollClass(g.id)" class="shrink-0 text-lg bg-night-800 border border-swamp-800 rounded-xl w-10 h-10 active:scale-90 transition" title="Reroll class">🎲</button>
      </div>
      <select
        :value="g.classId"
        @change="store.update(g.id, { classId: Number($event.target.value) })"
        class="mt-2 w-full bg-night-800 border border-swamp-800 rounded-xl px-3 py-2.5 font-bold text-swamp-100 focus:outline-none focus:border-swamp-400"
      >
        <option v-for="c in CLASSES" :key="c.id" :value="c.id">{{ c.id }}. {{ c.name }}</option>
      </select>
      <div class="mt-2.5 flex flex-wrap gap-1.5">
        <span v-for="s in classOf(g).skills" :key="s" class="bg-swamp-900 text-swamp-200 text-xs font-semibold rounded-full px-2.5 py-1">{{ s }}</span>
      </div>
      <div class="mt-3 bg-night-900 border border-swamp-900 rounded-xl p-3">
        <div class="text-[10px] uppercase tracking-widest text-swamp-400 font-bold mb-1">Ability</div>
        <p class="text-sm text-swamp-100/85 leading-relaxed">{{ classOf(g).ability }}</p>
        <p class="text-xs text-swamp-100/40 mt-1.5">Active abilities: just roll ass — you always succeed. Refreshes each mission.</p>
      </div>
    </div>

    <!-- Pockets -->
    <div class="rounded-2xl bg-night-850 border border-swamp-900 p-4">
      <div class="flex items-center justify-between">
        <div class="text-[10px] uppercase tracking-widest text-swamp-100/40 font-bold">Pocket contents <span class="normal-case font-normal">(lasts per mission)</span></div>
        <button @click="store.rerollPockets(g.id)" class="shrink-0 text-lg bg-night-800 border border-swamp-800 rounded-xl w-10 h-10 active:scale-90 transition" title="Reroll pockets">🎲</button>
      </div>
      <select
        :value="g.pocketId"
        @change="store.update(g.id, { pocketId: Number($event.target.value) })"
        class="mt-2 w-full bg-night-800 border border-swamp-800 rounded-xl px-3 py-2.5 text-sm font-semibold text-swamp-100 focus:outline-none focus:border-swamp-400"
      >
        <option v-for="p in POCKETS" :key="p.id" :value="p.id">Pockets #{{ p.id }}</option>
      </select>
      <p class="text-sm text-swamp-100/85 leading-relaxed mt-2.5">{{ pocketsOf(g).contents }}</p>
    </div>

    <!-- The Secret -->
    <div class="rounded-2xl bg-night-850 border border-swamp-900 p-4">
      <div class="flex items-center justify-between">
        <div class="text-[10px] uppercase tracking-widest text-swamp-100/40 font-bold">🤫 The secret</div>
        <button @click="store.rerollSecret(g.id)" class="shrink-0 text-lg bg-night-800 border border-swamp-800 rounded-xl w-10 h-10 active:scale-90 transition" title="Reroll the secret">🎲</button>
      </div>
      <button
        v-if="!g.secretRevealed"
        @click="toggleSecret"
        class="mt-2 w-full bg-night-900 border border-dashed border-swamp-800 rounded-xl py-3.5 text-sm font-bold text-swamp-100/60 active:scale-[0.98] transition"
      >
        Tap to peek (you can't unsee it)
      </button>
      <div v-else class="mt-2 rounded-xl p-3.5 border" :class="g.isKobold ? 'bg-amber-950/40 border-amber-800' : 'bg-night-900 border-swamp-900'">
        <p v-if="g.isKobold" class="text-sm font-bold text-amber-300">
          You are actually a KOBOLD. 🦎 Don't tell the goblins.
        </p>
        <p v-else class="text-sm text-swamp-100/80">
          You are a genuine goblin. Probably.
        </p>
        <button @click="toggleSecret" class="text-xs text-swamp-100/40 underline underline-offset-2 mt-1.5">hide it again</button>
      </div>
    </div>

    <button
      @click="store.go('roller')"
      class="w-full bg-swamp-600 hover:bg-swamp-500 text-white font-black text-lg rounded-2xl py-4 shadow-lg shadow-swamp-950 active:scale-[0.98] transition"
    >
      🎲 Go roll something
    </button>
  </div>
</template>
