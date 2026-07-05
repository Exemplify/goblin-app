<script setup>
import { computed } from 'vue';
import { useStore, STATUS_LABELS } from './store.js';
import MyGoblins from './views/MyGoblins.vue';
import CharacterSheet from './views/CharacterSheet.vue';
import Roller from './views/Roller.vue';
import Reference from './views/Reference.vue';

const store = useStore();

const views = { goblins: MyGoblins, sheet: CharacterSheet, roller: Roller, reference: Reference };
const current = computed(() => views[store.view] ?? MyGoblins);

const tabs = [
  { id: 'goblins', label: 'Goblins', icon: '👥' },
  { id: 'sheet', label: 'Sheet', icon: '📜' },
  { id: 'roller', label: 'Roller', icon: '🎲' },
  { id: 'reference', label: 'Rules', icon: '📖' },
];

const statusDot = computed(() => {
  const s = store.activeGoblin?.status;
  return s === 'fine' ? 'bg-swamp-400' : s === 'dazed' ? 'bg-amber-400' : 'bg-red-500';
});
</script>

<template>
  <div class="min-h-dvh bg-night-900 text-swamp-100 flex flex-col max-w-lg mx-auto">
    <!-- Header -->
    <header class="sticky top-0 z-20 bg-night-850/95 backdrop-blur border-b border-swamp-900 px-4 pt-[calc(env(safe-area-inset-top)+0.6rem)] pb-2.5 flex items-center justify-between">
      <h1 class="font-black tracking-tight leading-none">
        <span class="text-swamp-400 text-lg">GOBLIN</span>
        <span class="block text-[10px] text-swamp-200/60 font-semibold tracking-widest uppercase">with a fat ass · player assistant</span>
      </h1>
      <button
        v-if="store.activeGoblin"
        @click="store.go('sheet')"
        class="flex items-center gap-2 bg-night-800 border border-swamp-800 rounded-full pl-2.5 pr-3 py-1.5 text-sm active:scale-95 transition"
      >
        <span class="w-2 h-2 rounded-full" :class="statusDot"></span>
        <span class="font-semibold truncate max-w-28">{{ store.activeGoblin.name }}</span>
      </button>
    </header>

    <!-- Current view -->
    <main class="flex-1 px-4 py-4 pb-28">
      <component :is="current" />
    </main>

    <!-- Bottom tab bar -->
    <nav class="fixed bottom-0 inset-x-0 z-20 bg-night-850/95 backdrop-blur border-t border-swamp-900 max-w-lg mx-auto">
      <div class="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        <button
          v-for="t in tabs"
          :key="t.id"
          @click="store.go(t.id)"
          class="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition active:scale-95"
          :class="store.view === t.id ? 'text-swamp-300' : 'text-swamp-100/40'"
        >
          <span class="text-xl leading-none">{{ t.icon }}</span>
          {{ t.label }}
          <span class="h-0.5 w-8 rounded-full mt-0.5" :class="store.view === t.id ? 'bg-swamp-400' : 'bg-transparent'"></span>
        </button>
      </div>
    </nav>
  </div>
</template>
