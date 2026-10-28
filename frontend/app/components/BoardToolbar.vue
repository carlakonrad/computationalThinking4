<script setup lang="ts">
import type { ObjectType } from '~/types/board-object'

const emit = defineEmits<{ add: [type: ObjectType] }>()
</script>

<template>
  <div class="fixed bottom-6 left-1/2 flex -translate-x-1/2 gap-1 rounded-xl border bg-background p-1 shadow-lg">
    <Button
      v-for="(variant, type) in VARIANTS"
      :key="type"
      variant="ghost"
      size="lg"
      @click="emit('add', type)"
    >
      <component :is="variant.icon" />
      {{ variant.label }}
    </Button>
  </div>
</template>
