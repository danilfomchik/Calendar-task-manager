const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

// Dominant direction the wind blows from (degrees) -> 8-point compass label
export const formatWindDirection = (degrees: number | null) => {
  if (degrees === null) return null;

  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % COMPASS.length;

  return COMPASS[index];
};
