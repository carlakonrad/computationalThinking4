<script setup lang="ts">
import type { FontSize } from '~/types/board-object'

const OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
]

defineProps<{ value: FontSize }>()
const emit = defineEmits<{ change: [value: FontSize] }>()
</script>

<template>
  <div class="flex gap-0.5">
    <Button
      v-for="option in OPTIONS"
      :key="option.value"
      :variant="option.value === value ? 'secondary' : 'ghost'"
      size="icon-sm"
      @click="emit('change', option.value)"
    >
      {{ option.label }}
    </Button>
  </div>
</template>
