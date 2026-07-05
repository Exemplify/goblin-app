<script setup>
import { ref, computed } from 'vue';
import { REFERENCE } from '../gameData.js';

const query = ref('');
const openSections = ref(new Set());

const results = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return REFERENCE;
  return REFERENCE.filter(
    (s) => s.title.toLowerCase().includes(q) || s.tags.includes(q) || s.body.toLowerCase().includes(q)
  );
});

function toggle(title) {
  const s = new Set(openSections.value);
  s.has(title) ? s.delete(title) : s.add(title);
  openSections.value = s;
}

const isOpen = (title) => openSections.value.has(title) || query.value.trim().length > 0;
</script>

<template>
  <div class="space-y-3">
    <h2 class="text-xl font-black text-swamp-200">Rules reference</h2>

    <input
      v-model="query"
      type="search"
      placeholder="Search the rules… (e.g. dazed, chaos, thief)"
      class="w-full bg-night-850 border border-swamp-800 rounded-xl px-4 py-3 text-swamp-100 placeholder:text-swamp-100/30 focus:outline-none focus:border-swamp-400"
    />

    <p v-if="results.length === 0" class="text-center text-swamp-100/50 py-8">
      Nothing found. The rulebook is only two pages — try a shorter word?
    </p>

    <div
      v-for="s in results"
      :key="s.title"
      class="rounded-2xl bg-night-850 border border-swamp-900 overflow-hidden"
    >
      <button
        @click="toggle(s.title)"
        class="w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-night-800 transition"
      >
        <span class="font-bold text-swamp-100">{{ s.title }}</span>
        <span class="text-swamp-100/40 text-sm shrink-0 ml-2">{{ isOpen(s.title) ? '▾' : '▸' }}</span>
      </button>
      <p
        v-if="isOpen(s.title)"
        class="px-4 pb-4 text-sm text-swamp-100/80 leading-relaxed whitespace-pre-line"
      >{{ s.body }}</p>
    </div>

    <p class="text-xs text-swamp-100/30 text-center pt-2 pb-4">
      “Goblin With a Fat Ass” written by Tom Bloom, 2023. He apologizes in advance.
    </p>
  </div>
</template>
