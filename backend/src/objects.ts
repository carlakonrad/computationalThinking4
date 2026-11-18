import { Hono } from 'hono'
import { loadObjects, saveObjects, type BoardObject } from './storage'

// Every route loads the board, checks the request, saves and answers.
export const objects = new Hono()

objects.get('/', async c => c.json(await loadObjects()))

objects.post('/', async (c) => {
  const object = await c.req.json<BoardObject>()
  if (typeof object.id !== 'string') return c.json({ error: 'id fehlt' }, 400)
  const list = await loadObjects()
  if (list.some(o => o.id === object.id)) return c.json({ error: 'id existiert schon' }, 409)
  await saveObjects([...list, object])
  return c.json(object, 201)
})

objects.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const changes = await c.req.json<Partial<BoardObject>>()
  const list = await loadObjects()
  const object = list.find(o => o.id === id)
  if (!object) return c.json({ error: 'Objekt nicht gefunden' }, 404)
  const updated = { ...object, ...changes, id }
  await saveObjects(list.map(o => (o.id === id ? updated : o)))
  return c.json(updated)
})

objects.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const list = await loadObjects()
  if (!list.some(o => o.id === id)) return c.json({ error: 'Objekt nicht gefunden' }, 404)
  await saveObjects(list.filter(o => o.id !== id))
  return c.body(null, 204)
})
