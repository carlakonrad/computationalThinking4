import type { Component } from 'vue'
import type { BoardObject } from '~/types/canvas-object'
import { CircleShape, PlainText, StickyNote } from '#components'

// Which component renders which variant of canvas object.
export const VARIANTS: Record<BoardObject['type'], Component> = {
  'sticky-note': StickyNote,
  'text': PlainText,
  'circle': CircleShape,
}
