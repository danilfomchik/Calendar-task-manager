// Deterministic scatter in [0, 1) so the scene doesn't reshuffle on every render
export const scatter = (index: number, seed: number) => {
  const x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;

  return x - Math.floor(x);
};
