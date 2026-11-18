import { mkdir, readFile, writeFile } from 'node:fs/promises'

// The only place that knows where the board is stored.
const DIRECTORY = new URL('../data/', import.meta.url)
const FILE = new URL('board.json', DIRECTORY)

export interface BoardObject {
  id: string
  [key: string]: unknown
}

export async function loadObjects(): Promise<BoardObject[]> {
  try {
    return JSON.parse(await readFile(FILE, 'utf8'))
  } catch (error) {
    // No file yet means an empty board.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

export async function saveObjects(objects: BoardObject[]) {
  await mkdir(DIRECTORY, { recursive: true })
  await writeFile(FILE, JSON.stringify(objects, null, 2))
}
