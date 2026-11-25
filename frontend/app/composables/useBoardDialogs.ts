import type { Board } from '~/types/board'

type BoardDialog = { kind: 'create' } | { kind: 'rename'; board: Board } | { kind: 'delete'; board: Board }

// Which board dialog is open. The start page and the sidebar only open dialogs;
// BoardDialogs.vue shows them and carries out the change.
export function useBoardDialogs() {
  const dialog = useState<BoardDialog | null>('boardDialog', () => null)

  return {
    dialog: readonly(dialog),
    openCreate: () => (dialog.value = { kind: 'create' }),
    openRename: (board: Board) => (dialog.value = { kind: 'rename', board }),
    openDelete: (board: Board) => (dialog.value = { kind: 'delete', board }),
    close: () => (dialog.value = null),
  }
}
