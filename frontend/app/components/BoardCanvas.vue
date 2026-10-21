<script setup lang="ts">
import type { Note } from '~/types/note'

const pan = reactive({ x: 0, y: 0 })
const notes = ref<Note[]>([])

// Dots sit on the grid points and move with the pan offset.
const gridStyle = computed(() => ({
  backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
  backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
  backgroundPosition: `${pan.x - GRID_SIZE / 2}px ${pan.y - GRID_SIZE / 2}px`,
}))

function onPanStart(event: PointerEvent) {
  if (event.target !== event.currentTarget) return
  const start = { ...pan }
  startDrag(event, (dx, dy) => {
    pan.x = start.x + dx
    pan.y = start.y + dy
  })
}

function addNote(event: MouseEvent) {
  if (event.target !== event.currentTarget) return
  notes.value.push({
    id: crypto.randomUUID(),
    x: snap(event.clientX - pan.x),
    y: snap(event.clientY - pan.y),
    width: GRID_SIZE * 10,
    height: GRID_SIZE * 10,
    text: '',
  })
}

function removeNote(id: string) {
  notes.value = notes.value.filter(note => note.id !== id)
}
</script>

<template>
  <div
    class="fixed inset-0 cursor-grab touch-none overflow-hidden bg-neutral-50 select-none"
    :style="gridStyle"
    @pointerdown="onPanStart"
    @dblclick="addNote"
  >
    <div class="absolute top-0 left-0" :style="{ transform: `translate(${pan.x}px, ${pan.y}px)` }">
      <StickyNote
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @update="Object.assign(note, $event)"
        @delete="removeNote(note.id)"
      />
    </div>
    <p class="pointer-events-none absolute bottom-4 left-4 text-sm text-neutral-400">
      Doppelklick: Post-it erstellen · Hintergrund ziehen: Canvas verschieben
    </p>
  </div>
</template>
