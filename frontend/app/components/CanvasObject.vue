<script setup lang="ts">
import type { BoardObject, ObjectChanges } from '~/types/board-object'

type Corner = 'nw' | 'ne' | 'sw' | 'se'
type Mode = 'move' | Corner

const MIN_SIZE = GRID_SIZE * 3
const HANDLE_CLASSES: Record<Corner, string> = {
  nw: 'left-0 top-0 cursor-nwse-resize',
  ne: 'left-full top-0 cursor-nesw-resize',
  sw: 'left-0 top-full cursor-nesw-resize',
  se: 'left-full top-full cursor-nwse-resize',
}

const props = defineProps<{ object: BoardObject; selected: boolean }>()
const emit = defineEmits<{ select: []; change: [changes: ObjectChanges] }>()

const scale = inject<Ref<number>>('canvasScale', ref(1))
const editing = ref(false)

let interaction: { mode: Mode; startX: number; startY: number; start: BoardObject } | null = null

function startInteraction(event: PointerEvent, mode: Mode) {
  event.stopPropagation()
  emit('select')
  if (editing.value) return
  interaction = { mode, startX: event.clientX, startY: event.clientY, start: { ...props.object } }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

// Resizing from a north or west corner moves the object so the opposite corner stays put.
function nextRect(mode: Mode, start: BoardObject, dx: number, dy: number): ObjectChanges {
  if (mode === 'move') return { x: snapToGrid(start.x + dx), y: snapToGrid(start.y + dy) }
  const width = Math.max(MIN_SIZE, snapToGrid(start.width + (mode.endsWith('e') ? dx : -dx)))
  const height = Math.max(MIN_SIZE, snapToGrid(start.height + (mode.startsWith('s') ? dy : -dy)))
  return {
    width,
    height,
    x: mode.endsWith('w') ? start.x + start.width - width : start.x,
    y: mode.startsWith('n') ? start.y + start.height - height : start.y,
  }
}

function onPointerMove(event: PointerEvent) {
  if (!interaction) return
  const dx = (event.clientX - interaction.startX) / scale.value
  const dy = (event.clientY - interaction.startY) / scale.value
  emit('change', nextRect(interaction.mode, interaction.start, dx, dy))
}

function onPointerUp() {
  interaction = null
}

function startEditing() {
  editing.value = true
}

function stopEditing() {
  editing.value = false
}
</script>

<template>
  <div
    class="absolute text-lg touch-none"
    :class="[selected ? 'ring-2 ring-blue-300' : '', editing ? 'cursor-text' : 'cursor-move']"
    :style="{ left: `${object.x}px`, top: `${object.y}px`, width: `${object.width}px`, height: `${object.height}px` }"
    @pointerdown="startInteraction($event, 'move')"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @dblclick="startEditing"
  >
    <slot :editing="editing" :stop="stopEditing" />

    <template v-if="selected && !editing">
      <div
        v-for="(classes, corner) in HANDLE_CLASSES"
        :key="corner"
        class="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-blue-500 bg-background"
        :class="classes"
        @pointerdown="startInteraction($event, corner)"
      />
    </template>
  </div>
</template>
