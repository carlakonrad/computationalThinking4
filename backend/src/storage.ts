import { fileURLToPath } from 'node:url'

// The backend treats objects as plain JSON; it only relies on every object having an id.
export type BoardObject = { id: string } & Record<string, unknown>
export type Board = { id: string; name: string; createdAt: string }
type Row = Record<string, unknown>

// Boards and objects live in the Supabase tables "boards" and "objects", reached through its REST API.
// This module is the only place that knows about the database.
process.loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url)))
const URL_BASE = `${process.env.SUPABASE_URL}/rest/v1`
const HEADERS = {
  'apikey': process.env.SUPABASE_SECRET_KEY!,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
}

// Returns undefined when the id already exists, so the routes can answer with 409.
async function request(path: string, init: RequestInit = {}): Promise<Row[] | undefined> {
  const response = await fetch(`${URL_BASE}${path}`, { ...init, headers: HEADERS })
  if (response.status === 409) return undefined
  if (!response.ok) throw new Error(`Supabase: ${response.status} ${await response.text()}`)
  return response.json()
}

const byId = (id: string) => `id=eq.${encodeURIComponent(id)}`

// The table uses snake_case columns, the API keeps the camelCase fields of the frontend.
function toRow(object: Row) {
  const { fontSize, ...rest } = object
  return fontSize === undefined ? rest : { ...rest, font_size: fontSize }
}

// Empty columns are left out, so objects look the same as they did in the JSON file.
function toObject(row: Row) {
  const { font_size, created_at, board_id, ...rest } = row
  const object = Object.fromEntries(Object.entries({ ...rest, fontSize: font_size }).filter(([, value]) => value !== null))
  return object as BoardObject
}

function toBoard({ id, name, created_at }: Row) {
  return { id, name, createdAt: created_at } as Board
}

export async function listBoards() {
  const rows = await request('/boards?order=created_at.desc')
  return rows!.map(toBoard)
}

export async function getBoard(id: string) {
  const [row] = (await request(`/boards?${byId(id)}`))!
  return row && toBoard(row)
}

export async function insertBoard(id: string, name: string) {
  const rows = await request('/boards', { method: 'POST', body: JSON.stringify({ id, name }) })
  return rows && toBoard(rows[0])
}

export async function updateBoard(id: string, name: string) {
  const [row] = (await request(`/boards?${byId(id)}`, { method: 'PATCH', body: JSON.stringify({ name }) }))!
  return row && toBoard(row)
}

// The database deletes the board's objects along with it.
export async function deleteBoard(id: string) {
  const rows = await request(`/boards?${byId(id)}`, { method: 'DELETE' })
  return rows!.length > 0
}

export async function listObjects(boardId: string) {
  const rows = await request(`/objects?board_id=eq.${encodeURIComponent(boardId)}&order=created_at`)
  return rows!.map(toObject)
}

export async function insertObject(boardId: string, object: BoardObject) {
  const rows = await request('/objects', { method: 'POST', body: JSON.stringify({ ...toRow(object), board_id: boardId }) })
  return rows && toObject(rows[0])
}

export async function updateObject(id: string, changes: Record<string, unknown>) {
  const [row] = (await request(`/objects?${byId(id)}`, { method: 'PATCH', body: JSON.stringify(toRow({ ...changes, id })) }))!
  return row && toObject(row)
}

export async function deleteObject(id: string) {
  const rows = await request(`/objects?${byId(id)}`, { method: 'DELETE' })
  return rows!.length > 0
}
