<script setup lang="ts">
import type { ObjectColor } from '~/types/board-object'

defineProps<{ value: ObjectColor }>()
const emit = defineEmits<{ change: [value: ObjectColor] }>()
</script>

<template>
  <div class="flex items-center gap-1 px-1">
    <button
      v-for="(classes, color) in COLORS"
      :key="color"
      class="size-5 cursor-pointer rounded-full border border-black/10"
      :class="[classes, color === value ? 'ring-2 ring-blue-500 ring-offset-1' : '']"
      :aria-label="color"
      @click="emit('change', color)"
    />
  </div>
</template>
