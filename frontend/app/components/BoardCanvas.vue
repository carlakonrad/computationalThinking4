<script setup lang="ts">
import type { Note } from '~/types/note'

const MIN_SCALE = 0.2
const MAX_SCALE = 4

const pan = reactive({ x: 0, y: 0 })
const scale = ref(1)
const notes = ref<Note[]>([])

// Dots sit on the grid points and move with the pan offset and zoom.
const gridStyle = computed(() => {
  const size = GRID_SIZE * scale.value
  return {
    backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: `${pan.x - size / 2}px ${pan.y - size / 2}px`,
  }
})

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
    x: snap((event.clientX - pan.x) / scale.value),
    y: snap((event.clientY - pan.y) / scale.value),
    width: GRID_SIZE * 10,
    height: GRID_SIZE * 10,
    text: '',
  })
}

// Trackpad pinch arrives as a wheel event with ctrlKey. Zooms around the cursor.
function onWheel(event: WheelEvent) {
  if (!event.ctrlKey) return
  const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.value * Math.exp(-event.deltaY * 0.01)))
  pan.x = event.clientX - (event.clientX - pan.x) * next / scale.value
  pan.y = event.clientY - (event.clientY - pan.y) * next / scale.value
  scale.value = next
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
    @wheel.prevent="onWheel"
  >
    <div
      class="absolute top-0 left-0 origin-top-left"
      :style="{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }"
    >
      <StickyNote
        v-for="note in notes"
        :key="note.id"
        :note="note"
        :scale="scale"
        @update="Object.assign(note, $event)"
        @delete="removeNote(note.id)"
      />
    </div>
    <p class="pointer-events-none absolute bottom-4 left-4 text-sm text-neutral-400">
      Doppelklick: Post-it erstellen · Hintergrund ziehen: Canvas verschieben · Pinch: Zoomen
    </p>
  </div>
</template>
