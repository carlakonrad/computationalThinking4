import type { Component } from 'vue'
import { Circle, StickyNote as StickyNoteIcon, Type } from '@lucide/vue'
import type { Attribute, BoardObject, ObjectType } from '~/types/board-object'
import CircleShape from '~/components/CircleShape.vue'
import StickyNote from '~/components/StickyNote.vue'
import TextBox from '~/components/TextBox.vue'

interface Variant {
  label: string
  icon: Component
  component: Component
  attributes: Attribute[]
  defaults: Omit<BoardObject, 'id' | 'type' | 'x' | 'y'>
}

// Maps each object type to the component that draws it, the attributes the property bar offers,
// and the values a new object starts with.
export const VARIANTS: Record<ObjectType, Variant> = {
  note: {
    label: 'Post-it',
    icon: StickyNoteIcon,
    component: StickyNote,
    attributes: ['color', 'fontSize', 'bold'],
    defaults: { width: 192, height: 192, text: '', color: 'yellow', fontSize: 'md', bold: false, border: false },
  },
  circle: {
    label: 'Kreis',
    icon: Circle,
    component: CircleShape,
    attributes: ['color', 'border'],
    defaults: { width: 192, height: 192, text: '', color: 'blue', fontSize: 'md', bold: false, border: false },
  },
  text: {
    label: 'Text',
    icon: Type,
    component: TextBox,
    attributes: ['fontSize', 'bold'],
    defaults: { width: 192, height: 72, text: 'Text', color: 'yellow', fontSize: 'md', bold: false, border: false },
  },
}
