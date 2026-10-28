<script setup lang="ts">
import type { BoardObject, ObjectChanges } from '~/types/board-object'

defineProps<{ object: BoardObject }>()
const emit = defineEmits<{ change: [changes: ObjectChanges] }>()

const scale = inject<Ref<number>>('canvasScale', ref(1))
</script>

<template>
  <!-- Sits above the object's top-left corner and counters the zoom so it keeps its screen size. -->
  <div
    class="absolute flex origin-top-left items-center gap-1 rounded-lg border bg-background p-1 shadow-md"
    :style="{
      left: `${object.x}px`,
      top: `${object.y}px`,
      transform: `scale(${1 / scale}) translateY(calc(-100% - 12px))`,
    }"
    @pointerdown.stop
  >
    <component
      :is="EDITORS[attribute].component"
      v-for="attribute in VARIANTS[object.type].attributes"
      :key="attribute"
      v-bind="EDITORS[attribute].props"
      :value="object[attribute]"
      @change="emit('change', { [attribute]: $event })"
    />
  </div>
</template>
