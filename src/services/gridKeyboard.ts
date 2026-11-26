// How far each arrow key moves focus in a grid of `columns` cells per row (ARIA grid keyboard pattern): ←/→ one cell,
// ↑/↓ one row. Shared by the Month grid (7 columns) and the month picker (3 columns).
export const gridArrowSteps = (columns: number): Record<string, number> => ({
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -columns,
  ArrowDown: columns,
});
