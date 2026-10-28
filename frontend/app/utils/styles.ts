import type { FontSize, ObjectColor } from '~/types/board-object'

export const COLORS: Record<ObjectColor, string> = {
  yellow: 'bg-yellow-200',
  pink: 'bg-pink-200',
  green: 'bg-green-200',
  blue: 'bg-sky-200',
  orange: 'bg-orange-200',
}

export const FONT_SIZES: Record<FontSize, string> = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-2xl',
}
