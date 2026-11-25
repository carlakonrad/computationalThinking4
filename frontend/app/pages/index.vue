<script setup lang="ts">
import { Plus } from '@lucide/vue'

const { boards, load } = useBoards()
const { openCreate } = useBoardDialogs()
await load()
</script>

<template>
  <main class="min-h-screen bg-background p-10">
    <h1 class="mb-8 text-2xl font-semibold">Boards</h1>
    <div class="flex flex-wrap gap-6">
      <button
        class="flex w-64 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-muted-foreground hover:bg-muted"
        @click="openCreate"
      >
        <Plus class="size-6" />
        Neues Board
      </button>
      <BoardTile v-for="board in boards" :key="board.id" :board="board" />
    </div>
  </main>
</template>
