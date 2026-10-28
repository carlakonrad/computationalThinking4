<script setup lang="ts">
import type { BoardObject, ObjectChanges } from '~/types/board-object'

const props = defineProps<{ object: BoardObject; editing: boolean }>()
const emit = defineEmits<{ stop: []; change: [changes: ObjectChanges] }>()

const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')
const content = useTemplateRef<HTMLElement>('content')
const textClasses = computed(() => [FONT_SIZES[props.object.fontSize], props.object.bold ? 'font-bold' : ''])

function updateText(event: Event) {
  emit('change', { text: (event.target as HTMLTextAreaElement).value })
}

// Grows the object to the next grid line when its text no longer fits.
async function fitToContent() {
  await nextTick()
  const element = textarea.value ?? content.value
  if (!element) return
  const needed = Math.ceil(element.scrollHeight / GRID_SIZE) * GRID_SIZE
  if (needed > props.object.height) emit('change', { height: needed })
}

watch(() => props.editing, async (editing) => {
  if (!editing) return
  await nextTick()
  textarea.value?.focus()
  textarea.value?.select()
})
watch(
  () => [props.object.text, props.object.width, props.object.height, props.object.fontSize, props.object.bold, props.editing],
  fitToContent,
)
onMounted(fitToContent)
</script>

<template>
  <textarea
    v-if="editing"
    ref="textarea"
    class="size-full p-4 bg-transparent resize-none outline-none"
    :class="textClasses"
    :value="object.text"
    @input="updateText"
    @blur="emit('stop')"
    @keydown.escape="emit('stop')"
  />
  <div
    v-else
    ref="content"
    class="size-full p-4 overflow-hidden whitespace-pre-wrap break-words select-none"
    :class="textClasses"
  >
    {{ object.text }}
  </div>
</template>
