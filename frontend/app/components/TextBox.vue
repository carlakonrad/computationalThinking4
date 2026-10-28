<script setup lang="ts">
import type { BoardObject, ObjectChanges } from '~/types/board-object'

defineProps<{ object: BoardObject }>()
const emit = defineEmits<{ change: [changes: ObjectChanges] }>()
</script>

<template>
  <CanvasObject :object="object" class="bg-transparent" @change="emit('change', $event)">
    <template #default="{ editing, stop }">
      <ObjectText :object="object" :editing="editing" @stop="stop" @change="emit('change', $event)" />
    </template>
  </CanvasObject>
</template>
