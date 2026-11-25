import type { Board } from '~/types/board'

// The list of all boards, newest first. Every change updates the list right away
// once the backend has confirmed it.
export function useBoards() {
  const api = useApi()
  const boards = useState<Board[]>('boards', () => [])

  async function load() {
    boards.value = await api<Board[]>('/boards')
  }

  async function create(name: string) {
    const board = await api<Board>('/boards', { method: 'POST', body: { id: crypto.randomUUID(), name } })
    boards.value = [board, ...boards.value]
    return board
  }

  async function rename(id: string, name: string) {
    const renamed = await api<Board>(`/boards/${id}`, { method: 'PATCH', body: { name } })
    boards.value = boards.value.map(board => (board.id === id ? renamed : board))
  }

  // The backend deletes the board's objects along with it.
  async function remove(id: string) {
    await api(`/boards/${id}`, { method: 'DELETE' })
    boards.value = boards.value.filter(board => board.id !== id)
  }

  return { boards: readonly(boards), load, create, rename, remove }
}
