<script setup lang="ts">
import type { Board } from '~/types/board'

defineProps<{ board: Board }>()

const DATE_FORMAT = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' })
</script>

<template>
  <NuxtLink
    :to="`/boards/${board.id}`"
    class="group w-64 overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
  >
    <BoardPreview :board-id="board.id" class="border-b" />
    <div class="flex items-center gap-2 p-3">
      <div class="min-w-0 flex-1">
        <p class="truncate font-medium">{{ board.name }}</p>
        <p class="text-sm text-muted-foreground">{{ DATE_FORMAT.format(new Date(board.createdAt)) }}</p>
      </div>
      <BoardActions :board="board" />
    </div>
  </NuxtLink>
</template>
