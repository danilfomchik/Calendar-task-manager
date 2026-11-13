// Shared by the Dial and the loading skeleton so the block doesn't jump when the weather lands
export const DIAL_SIZE = 136;
export const DIAL_RING_WIDTH = 6;
// the Sky scene sits this far inside the ring
export const DIAL_FACE_INSET = 14;

export const getRingRadius = (size: number) => size / 2 - 8;

export const DIAL_CENTRE = DIAL_SIZE / 2;
export const DIAL_RADIUS = getRingRadius(DIAL_SIZE);
export const DIAL_CIRCUMFERENCE = 2 * Math.PI * DIAL_RADIUS;

// Point at `angle` degrees clockwise from 12 o'clock, `radius` from the centre of a square of `size`
export const polar = (size: number, angle: number, radius: number) => {
  const centre = size / 2;
  const radians = ((angle - 90) * Math.PI) / 180;

  return [centre + radius * Math.cos(radians), centre + radius * Math.sin(radians)] as const;
};
