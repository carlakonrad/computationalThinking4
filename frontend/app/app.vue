<script setup lang="ts">
import type { ObjectType } from '~/types/board-object'

const canvas = useTemplateRef('canvas')
const { objects, addObject, updateObject } = useBoard()
const selectedId = ref<string | null>(null)
const selected = computed(() => objects.value.find(object => object.id === selectedId.value))
useShortcuts(selectedId)

// Places the new object in the middle of the visible area.
function createObject(type: ObjectType) {
  if (!canvas.value) return
  const { defaults } = VARIANTS[type]
  const center = canvas.value.toCanvas(window.innerWidth / 2, window.innerHeight / 2)
  const object = {
    id: crypto.randomUUID(),
    type,
    x: snapToGrid(center.x - defaults.width / 2),
    y: snapToGrid(center.y - defaults.height / 2),
    ...defaults,
  }
  addObject(object)
  selectedId.value = object.id
}
</script>

<template>
  <InfiniteCanvas ref="canvas" @pointerdown="selectedId = null">
    <component
      :is="VARIANTS[object.type].component"
      v-for="object in objects"
      :key="object.id"
      :object="object"
      :selected="object.id === selectedId"
      @select="selectedId = object.id"
      @change="updateObject(object.id, $event)"
    />
    <PropertyBar v-if="selected" :object="selected" @change="updateObject(selected.id, $event)" />
  </InfiniteCanvas>
  <BoardToolbar @add="createObject" />
</template>
