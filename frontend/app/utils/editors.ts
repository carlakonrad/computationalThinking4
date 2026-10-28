import type { Component } from 'vue'
import { Bold, Square } from '@lucide/vue'
import type { Attribute } from '~/types/board-object'
import ColorEditor from '~/components/ColorEditor.vue'
import FontSizeEditor from '~/components/FontSizeEditor.vue'
import ToggleEditor from '~/components/ToggleEditor.vue'

interface Editor {
  component: Component
  props?: Record<string, unknown>
}

// Maps each editable attribute to the editor the property bar shows for it.
export const EDITORS: Record<Attribute, Editor> = {
  color: { component: ColorEditor },
  fontSize: { component: FontSizeEditor },
  bold: { component: ToggleEditor, props: { icon: Bold, label: 'Fett' } },
  border: { component: ToggleEditor, props: { icon: Square, label: 'Rahmen' } },
}
