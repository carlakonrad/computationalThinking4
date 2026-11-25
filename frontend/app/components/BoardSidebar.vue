<script setup lang="ts">
import { House, PanelLeftClose, PanelLeftOpen, Plus } from '@lucide/vue'

defineProps<{ activeId: string }>()
const { boards, load } = useBoards()
const { openCreate } = useBoardDialogs()
onMounted(load)

// The list starts open on every visit; collapsing is not remembered.
const open = ref(true)

const ICON_BUTTON_CLASS = 'flex size-9 items-center justify-center rounded-lg hover:bg-muted'
</script>

<template>
  <!-- Floats over the canvas like the toolbar. Home and collapse stay visible when collapsed. -->
  <aside class="fixed top-4 left-4 flex flex-col rounded-2xl border bg-white shadow-xl" :class="open ? 'bottom-4 w-60' : ''">
    <div class="flex items-center gap-1 p-2">
      <NuxtLink to="/" :class="ICON_BUTTON_CLASS" aria-label="Alle Boards">
        <House class="size-5" />
      </NuxtLink>
      <button :class="ICON_BUTTON_CLASS" :aria-label="open ? 'Liste einklappen' : 'Liste ausklappen'" @click="open = !open">
        <PanelLeftClose v-if="open" class="size-5" />
        <PanelLeftOpen v-else class="size-5" />
      </button>
    </div>

    <template v-if="open">
      <nav class="flex-1 overflow-y-auto px-2">
        <NuxtLink
          v-for="board in boards"
          :key="board.id"
          :to="`/boards/${board.id}`"
          class="group flex items-center gap-1 rounded-lg py-1 pr-1 pl-3 text-sm hover:bg-muted"
          :class="board.id === activeId ? 'bg-muted font-medium' : ''"
        >
          <span class="flex-1 truncate">{{ board.name }}</span>
          <BoardActions :board="board" />
        </NuxtLink>
      </nav>
      <div class="border-t p-2">
        <Button variant="ghost" class="w-full justify-start" @click="openCreate">
          <Plus />
          Neues Board
        </Button>
      </div>
    </template>
  </aside>
</template>
