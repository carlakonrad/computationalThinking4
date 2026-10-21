<script setup lang="ts">
import type { Note } from '~/types/note'

const props = defineProps<{ note: Note, scale: number }>()
const emit = defineEmits<{ update: [changes: Partial<Note>], delete: [] }>()

const MIN_SIZE = GRID_SIZE * 4
const corners = [
  { class: '-top-2 -left-2 cursor-nwse-resize', left: true, top: true },
  { class: '-top-2 -right-2 cursor-nesw-resize', left: false, top: true },
  { class: '-bottom-2 -left-2 cursor-nesw-resize', left: true, top: false },
  { class: '-bottom-2 -right-2 cursor-nwse-resize', left: false, top: false },
]
const editing = ref(false)
const textarea = ref<HTMLTextAreaElement>()

function onMoveStart(event: PointerEvent) {
  if (editing.value) return
  const { x, y } = props.note
  startDrag(event, (dx, dy) => emit('update', { x: snap(x + dx / props.scale), y: snap(y + dy / props.scale) }))
}

// Resizes one axis; when dragging from the start side, the opposite edge stays fixed.
function resizeAxis(start: number, size: number, delta: number, fromStart: boolean) {
  if (!fromStart) return { start, size: Math.max(MIN_SIZE, snap(size + delta)) }
  const end = start + size
  const newStart = Math.min(snap(start + delta), end - MIN_SIZE)
  return { start: newStart, size: end - newStart }
}

function onResizeStart(event: PointerEvent, corner: typeof corners[number]) {
  const { x, y, width, height } = props.note
  startDrag(event, (dx, dy) => {
    const h = resizeAxis(x, width, dx / props.scale, corner.left)
    const v = resizeAxis(y, height, dy / props.scale, corner.top)
    emit('update', { x: h.start, width: h.size, y: v.start, height: v.size })
  })
}

async function startEditing() {
  editing.value = true
  await nextTick()
  textarea.value?.focus()
}
</script>

<template>
  <div
    class="group absolute flex flex-col rounded-sm bg-yellow-200 p-3 shadow-md"
    :class="editing ? 'cursor-text' : 'cursor-move'"
    :style="{ left: `${note.x}px`, top: `${note.y}px`, width: `${note.width}px`, height: `${note.height}px` }"
    @pointerdown="onMoveStart"
    @dblclick="startEditing"
  >
    <textarea
      v-if="editing"
      ref="textarea"
      class="flex-1 resize-none bg-transparent outline-none select-text"
      :value="note.text"
      @input="emit('update', { text: ($event.target as HTMLTextAreaElement).value })"
      @blur="editing = false"
    />
    <p v-else class="flex-1 overflow-hidden break-words whitespace-pre-wrap">{{ note.text }}</p>
    <button
      class="absolute top-2 right-2 flex size-5 cursor-pointer items-center justify-center rounded-full text-neutral-600 opacity-0 group-hover:opacity-100 hover:bg-yellow-300"
      aria-label="Post-it löschen"
      @pointerdown.stop
      @click="emit('delete')"
    >
      ✕
    </button>
    <div
      v-for="corner in corners"
      :key="corner.class"
      class="absolute size-4"
      :class="corner.class"
      @pointerdown.stop="onResizeStart($event, corner)"
    />
  </div>
</template>
