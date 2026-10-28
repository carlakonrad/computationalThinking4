import type { BoardObject } from '~/types/board-object'
import type { ShortcutAction } from '~/utils/shortcuts'

// Runs the action of the matching entry in SHORTCUTS. The clipboard stays local to this board.
export function useShortcuts(selectedId: Ref<string | null>) {
  const { objects, addObject, updateObject, removeObject } = useBoard()
  const clipboard = ref<BoardObject | null>(null)
  const selected = computed(() => objects.value.find(o => o.id === selectedId.value))

  // Adds a copy one grid step down and to the right, and selects it.
  function addCopy(object: BoardObject) {
    const copy = { ...object, id: crypto.randomUUID(), x: object.x + GRID_SIZE, y: object.y + GRID_SIZE }
    addObject(copy)
    selectedId.value = copy.id
    return copy
  }

  function moveBy(dx: number, dy: number) {
    if (!selected.value) return
    updateObject(selected.value.id, { x: selected.value.x + dx * GRID_SIZE, y: selected.value.y + dy * GRID_SIZE })
  }

  const actions: Record<ShortcutAction, () => void> = {
    copy: () => {
      if (selected.value) clipboard.value = { ...selected.value }
    },
    cut: () => {
      actions.copy()
      actions.remove()
    },
    paste: () => {
      if (clipboard.value) clipboard.value = addCopy(clipboard.value)
    },
    duplicate: () => {
      if (selected.value) addCopy(selected.value)
    },
    remove: () => {
      if (selected.value) removeObject(selected.value.id)
      selectedId.value = null
    },
    deselect: () => {
      selectedId.value = null
    },
    moveLeft: () => moveBy(-1, 0),
    moveRight: () => moveBy(1, 0),
    moveUp: () => moveBy(0, -1),
    moveDown: () => moveBy(0, 1),
  }

  function onKeydown(event: KeyboardEvent) {
    // While typing in a text field, keys belong to the text.
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
    const shortcut = SHORTCUTS.find(s => s.matches(event))
    if (!shortcut) return
    event.preventDefault()
    actions[shortcut.action]()
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
}
