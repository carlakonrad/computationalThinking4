import type { BoardObject, ObjectChanges } from '~/types/board-object'

// Shared board state. Components only read the objects and change them through these functions.
export function useBoard() {
  const objects = useState<BoardObject[]>('board-objects', () => [
    { id: crypto.randomUUID(), type: 'note', x: 120, y: 120, ...VARIANTS.note.defaults, text: 'Hello, board!' },
  ])

  function addObject(object: BoardObject) {
    objects.value.push(object)
  }

  function updateObject(id: string, changes: ObjectChanges) {
    const object = objects.value.find(o => o.id === id)
    if (object) Object.assign(object, changes)
  }

  function removeObject(id: string) {
    objects.value = objects.value.filter(o => o.id !== id)
  }

  return { objects: readonly(objects), addObject, updateObject, removeObject }
}
