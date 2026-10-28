<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{ value: boolean; icon: Component; label: string }>()
const emit = defineEmits<{ change: [value: boolean] }>()
</script>

<template>
  <Button
    :variant="value ? 'secondary' : 'ghost'"
    size="icon-sm"
    :aria-label="label"
    :aria-pressed="value"
    @click="emit('change', !value)"
  >
    <component :is="icon" />
  </Button>
</template>
