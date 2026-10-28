export type ShortcutAction =
  | 'copy' | 'cut' | 'paste' | 'duplicate' | 'remove' | 'deselect'
  | 'moveLeft' | 'moveRight' | 'moveUp' | 'moveDown'

interface Shortcut {
  keys: string
  label: string
  matches: (event: KeyboardEvent) => boolean
  action: ShortcutAction
}

// ⌘ on Mac, Ctrl on Windows and Linux.
const isMod = (event: KeyboardEvent) => event.metaKey || event.ctrlKey
const withMod = (key: string) => (event: KeyboardEvent) => isMod(event) && event.key.toLowerCase() === key
const plain = (...keys: string[]) => (event: KeyboardEvent) => !isMod(event) && keys.includes(event.key)

export const SHORTCUTS: Shortcut[] = [
  { keys: '⌘C', label: 'Kopieren', matches: withMod('c'), action: 'copy' },
  { keys: '⌘X', label: 'Ausschneiden', matches: withMod('x'), action: 'cut' },
  { keys: '⌘V', label: 'Einfügen', matches: withMod('v'), action: 'paste' },
  { keys: '⌘D', label: 'Duplizieren', matches: withMod('d'), action: 'duplicate' },
  { keys: '⌫', label: 'Löschen', matches: plain('Backspace', 'Delete'), action: 'remove' },
  { keys: 'Esc', label: 'Auswahl aufheben', matches: plain('Escape'), action: 'deselect' },
  { keys: '←', label: 'Nach links', matches: plain('ArrowLeft'), action: 'moveLeft' },
  { keys: '→', label: 'Nach rechts', matches: plain('ArrowRight'), action: 'moveRight' },
  { keys: '↑', label: 'Nach oben', matches: plain('ArrowUp'), action: 'moveUp' },
  { keys: '↓', label: 'Nach unten', matches: plain('ArrowDown'), action: 'moveDown' },
]
