export const GRID_SIZE = 20

export const snap = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE
