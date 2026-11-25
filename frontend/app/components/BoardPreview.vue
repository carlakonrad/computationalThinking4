<script setup lang="ts">
import type { BoardObject } from '~/types/canvas-object'

// The preview has the size of a tile; objects keep a small margin to its edges.
const WIDTH = 256
const HEIGHT = 160
const PADDING = 16

const props = defineProps<{ boardId: string }>()
const api = useApi()

// Undefined while loading, so an empty board only says "Leer" once that is certain.
const objects = ref<BoardObject[]>()
onMounted(async () => {
  objects.value = await api<BoardObject[]>(`/boards/${props.boardId}/objects`)
})

// Zooms so that all objects fit into the tile, centered, but never larger than on the board.
const transform = computed(() => {
  const list = objects.value ?? []
  if (!list.length) return ''
  const left = Math.min(...list.map(object => object.x))
  const top = Math.min(...list.map(object => object.y))
  const width = Math.max(...list.map(object => object.x + object.width)) - left
  const height = Math.max(...list.map(object => object.y + object.height)) - top
  const scale = Math.min((WIDTH - 2 * PADDING) / width, (HEIGHT - 2 * PADDING) / height, 1)
  const x = (WIDTH - width * scale) / 2 - left * scale
  const y = (HEIGHT - height * scale) / 2 - top * scale
  return `translate(${x}px, ${y}px) scale(${scale})`
})
</script>

<template>
  <div class="relative overflow-hidden bg-background" :style="{ width: `${WIDTH}px`, height: `${HEIGHT}px` }">
    <p v-if="objects && !objects.length" class="flex size-full items-center justify-center text-sm text-muted-foreground">
      Leer
    </p>
    <!-- The same components as on the board, but nothing in the preview reacts to the mouse. -->
    <div v-else class="pointer-events-none absolute top-0 left-0 origin-top-left" :style="{ transform }">
      <component
        :is="VARIANTS[object.type]"
        v-for="object in objects"
        :key="object.id"
        :object="object"
        :selected="false"
        :editing="false"
      />
    </div>
  </div>
</template>
