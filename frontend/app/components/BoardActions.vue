<script setup lang="ts">
import { Pencil, Trash2 } from '@lucide/vue'
import type { Board } from '~/types/board'

// Rename and delete buttons for one board. They appear while the surrounding `group` is hovered.
defineProps<{ board: Board }>()
const { openRename, openDelete } = useBoardDialogs()

const BUTTON_CLASS = 'flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-black/10 hover:text-foreground'
</script>

<template>
  <div class="flex gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
    <button :class="BUTTON_CLASS" aria-label="Board umbenennen" @click.prevent.stop="openRename(board)">
      <Pencil class="size-4" />
    </button>
    <button :class="BUTTON_CLASS" aria-label="Board löschen" @click.prevent.stop="openDelete(board)">
      <Trash2 class="size-4" />
    </button>
  </div>
</template>
