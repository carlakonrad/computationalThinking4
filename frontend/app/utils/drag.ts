// Calls onMove with the pointer offset since the drag started, until the pointer is released.
export function startDrag(event: PointerEvent, onMove: (dx: number, dy: number) => void) {
  const startX = event.clientX
  const startY = event.clientY

  const move = (e: PointerEvent) => onMove(e.clientX - startX, e.clientY - startY)
  const up = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
  }

  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}
