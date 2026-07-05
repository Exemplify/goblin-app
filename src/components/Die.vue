<script setup>
defineProps({
  value: { type: Number, required: true },
  // 'default' | 'good' | 'bad' | 'cancelled' | 'dim'
  tone: { type: String, default: 'default' },
});

const PIPS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};
</script>

<template>
  <div
    class="die-pop relative w-11 h-11 rounded-lg border-2 grid grid-cols-3 grid-rows-3 p-1.5 shrink-0 transition"
    :class="{
      'bg-swamp-100 border-swamp-300': tone === 'default',
      'bg-swamp-400 border-swamp-200 shadow-[0_0_12px_rgba(91,195,122,0.6)]': tone === 'good',
      'bg-red-400 border-red-200 shadow-[0_0_12px_rgba(248,113,113,0.6)]': tone === 'bad',
      'bg-night-800 border-swamp-900 opacity-50': tone === 'cancelled',
      'bg-swamp-100/40 border-swamp-300/30 opacity-50': tone === 'dim',
    }"
  >
    <span
      v-for="cell in 9"
      :key="cell"
      class="flex items-center justify-center"
    >
      <span
        v-if="PIPS[value]?.includes(cell - 1)"
        class="w-1.5 h-1.5 rounded-full"
        :class="tone === 'cancelled' ? 'bg-swamp-100/40' : 'bg-night-900'"
      ></span>
    </span>
    <span v-if="tone === 'cancelled'" class="absolute inset-0 flex items-center justify-center text-red-400 text-2xl font-black">✕</span>
  </div>
</template>
