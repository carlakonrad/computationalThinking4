import type { BoardObject, ObjectTemplate, Rect, StyleChanges, TextObject } from '~/types/canvas-object'

type ObjectChanges = Partial<Rect> & StyleChanges & { text?: string }

const API = 'http://localhost:3001/objects'
// While an object is dragged, its changes are sent once the pointer has paused this long.
const SAVE_DELAY = 300

const TEXT_DEFAULTS = { text: '', fontSize: FONT_SIZES.M, bold: false }

// Starting attributes of a new object, per variant. Only variants with text get text attributes.
const DEFAULTS: Record<BoardObject['type'], Rect & Partial<TextObject>> = {
  'sticky-note': { x: 0, y: 0, width: GRID_SIZE * 8, height: GRID_SIZE * 8, ...TEXT_DEFAULTS },
  'text': { x: 0, y: 0, width: GRID_SIZE * 10, height: GRID_SIZE * 3, ...TEXT_DEFAULTS },
  'circle': { x: 0, y: 0, width: GRID_SIZE * 6, height: GRID_SIZE * 6 },
}

// Changes of a running gesture, collected per object until they are sent.
const pending = new Map<string, { changes: ObjectChanges; timer: ReturnType<typeof setTimeout> }>()
let loaded = false

// The board state is the single source of truth for which objects exist and what they look like.
// Components only read it; every change goes through one of the functions below.
// Each function changes the local state first and then tells the backend.
export function useBoard() {
  const objects = useState<BoardObject[]>('objects', () => [])

  async function load() {
    objects.value = await $fetch<BoardObject[]>(API)
  }

  // Load once per page, in the browser, no matter how many components use the board.
  if (import.meta.client && !loaded) {
    loaded = true
    load()
  }

  function addObject(template: ObjectTemplate, centerX: number, centerY: number) {
    const defaults = DEFAULTS[template.type]
    const id = crypto.randomUUID()
    const x = snapToGrid(centerX - defaults.width / 2)
    const y = snapToGrid(centerY - defaults.height / 2)
    const object = { ...defaults, ...template, id, x, y } as BoardObject
    objects.value = [...objects.value, object]
    $fetch(API, { method: 'POST', body: object })
    return id
  }

  // Works for every variant: the copy keeps all attributes except the id.
  function addCopy(source: BoardObject) {
    const object = { ...source, id: crypto.randomUUID() }
    objects.value = [...objects.value, object]
    $fetch(API, { method: 'POST', body: object })
    return object.id
  }

  function removeObject(id: string) {
    objects.value = objects.value.filter(object => object.id !== id)
    // A gesture still waiting to be sent would otherwise arrive after the delete.
    clearTimeout(pending.get(id)?.timer)
    pending.delete(id)
    $fetch(`${API}/${id}`, { method: 'DELETE' })
  }

  function changeLocally(id: string, changes: ObjectChanges) {
    objects.value = objects.value.map(object => (object.id === id ? ({ ...object, ...changes } as BoardObject) : object))
  }

  function send(id: string, changes: ObjectChanges) {
    $fetch(`${API}/${id}`, { method: 'PATCH', body: changes })
  }

  // Collects the changes of a drag and sends them in one PATCH after SAVE_DELAY without new changes.
  function sendAfterPause(id: string, changes: ObjectChanges) {
    const previous = pending.get(id)
    clearTimeout(previous?.timer)
    const collected = { ...previous?.changes, ...changes }
    const timer = setTimeout(() => {
      pending.delete(id)
      send(id, collected)
    }, SAVE_DELAY)
    pending.set(id, { changes: collected, timer })
  }

  function updateObject(id: string, changes: ObjectChanges) {
    changeLocally(id, changes)
    send(id, changes)
  }

  function moveObject(id: string, x: number, y: number) {
    changeLocally(id, { x, y })
    sendAfterPause(id, { x, y })
  }

  function resizeObject(id: string, rect: Rect) {
    changeLocally(id, rect)
    sendAfterPause(id, rect)
  }

  function updateText(id: string, text: string) {
    updateObject(id, { text })
  }

  function updateStyle(id: string, changes: StyleChanges) {
    updateObject(id, changes)
  }

  return { objects: readonly(objects), addObject, addCopy, removeObject, moveObject, resizeObject, updateText, updateStyle }
}
