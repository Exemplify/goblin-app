<script setup>
import { ref } from 'vue';
import { useStore, classOf, assLabel, STATUS_LABELS } from '../store.js';

const store = useStore();
const confirmingDelete = ref(null);

function open(g) {
  store.setActive(g.id);
  store.go('sheet');
}

function askDelete(id) {
  confirmingDelete.value = id;
}

function doDelete(id) {
  store.deleteGoblin(id);
  confirmingDelete.value = null;
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-black text-swamp-200">My Goblins</h2>
      <button
        @click="store.newGoblin()"
        class="bg-swamp-600 hover:bg-swamp-500 text-white font-bold rounded-xl px-4 py-2.5 shadow-lg shadow-swamp-950 active:scale-95 transition"
      >
        + New Goblin
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="store.goblins.length === 0" class="text-center py-16 space-y-4">
      <div class="text-6xl">🟢</div>
      <p class="text-swamp-100/70 leading-relaxed px-6">
        No goblins yet. Tap <span class="font-bold text-swamp-300">+ New Goblin</span> and the app rolls
        everything for you — ass size, origin, class, pockets, and one little secret.
      </p>
    </div>

    <!-- Goblin cards -->
    <div
      v-for="g in store.goblins"
      :key="g.id"
      class="rounded-2xl border transition overflow-hidden"
      :class="g.id === store.activeGoblinId ? 'border-swamp-500 bg-night-800' : 'border-swamp-900 bg-night-850'"
    >
      <button @click="open(g)" class="w-full text-left p-4 active:bg-night-800 transition">
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-black text-lg text-swamp-100 truncate">{{ g.name }}</span>
              <span
                v-if="g.id === store.activeGoblinId"
                class="text-[10px] uppercase tracking-wider font-bold bg-swamp-700 text-swamp-100 rounded-full px-2 py-0.5 shrink-0"
              >active</span>
            </div>
            <div class="text-sm text-swamp-100/60 mt-0.5 truncate">
              {{ classOf(g).name }} · ass {{ g.assSize }} ({{ assLabel(g.assSize) }})
            </div>
          </div>
          <span
            class="text-[11px] font-bold rounded-full px-2.5 py-1 shrink-0"
            :class="{
              'bg-swamp-800 text-swamp-200': g.status === 'fine',
              'bg-amber-900 text-amber-200': g.status === 'dazed',
              'bg-red-950 text-red-300': g.status === 'knockedOut',
            }"
          >{{ STATUS_LABELS[g.status] }}</span>
        </div>
      </button>

      <div class="flex border-t border-swamp-900/60 divide-x divide-swamp-900/60 text-sm">
        <button
          v-if="g.id !== store.activeGoblinId"
          @click="store.setActive(g.id)"
          class="flex-1 py-2.5 font-semibold text-swamp-300 active:bg-night-800 transition"
        >Make active</button>
        <button
          v-if="confirmingDelete !== g.id"
          @click="askDelete(g.id)"
          class="flex-1 py-2.5 font-semibold text-red-400/70 active:bg-night-800 transition"
        >Delete</button>
        <template v-else>
          <button @click="doDelete(g.id)" class="flex-1 py-2.5 font-bold text-red-400 bg-red-950/40">Really delete?</button>
          <button @click="confirmingDelete = null" class="flex-1 py-2.5 font-semibold text-swamp-300">Keep</button>
        </template>
      </div>
    </div>

    <p v-if="store.goblins.length" class="text-xs text-swamp-100/40 text-center pt-2">
      Everything is saved on this device automatically. The active goblin feeds the Roller.
    </p>
  </div>
</template>
