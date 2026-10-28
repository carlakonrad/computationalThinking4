export type ObjectType = 'note' | 'circle' | 'text'
export type ObjectColor = 'yellow' | 'pink' | 'green' | 'blue' | 'orange'
export type FontSize = 'sm' | 'md' | 'lg'
export type Attribute = 'color' | 'fontSize' | 'bold' | 'border'

export interface BoardObject {
  id: string
  type: ObjectType
  x: number
  y: number
  width: number
  height: number
  text: string
  color: ObjectColor
  fontSize: FontSize
  bold: boolean
  border: boolean
}

export type ObjectChanges = Partial<Omit<BoardObject, 'id' | 'type'>>
