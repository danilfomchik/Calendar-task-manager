import {TMoonDiscProps} from './types';

const SIZE = 20;
const CENTRE = SIZE / 2;
const RADIUS = 9;

// The moon's phase as a flat two-tone disc. The lit side is a half disc plus the curve of the terminator.
const MoonDisc = ({fraction, isSouthern}: TMoonDiscProps) => {
  // 1 at a new moon, 0 at a quarter, -1 at a full moon
  const terminator = Math.cos(2 * Math.PI * fraction);
  const isWaning = fraction > 0.5;
  const top = CENTRE - RADIUS;
  const bottom = CENTRE + RADIUS;
  const lit = [
    `M ${CENTRE} ${top}`,
    `A ${RADIUS} ${RADIUS} 0 0 1 ${CENTRE} ${bottom}`,
    `A ${RADIUS * Math.abs(terminator)} ${RADIUS} 0 0 ${terminator > 0 ? 0 : 1} ${CENTRE} ${top}`,
    'Z',
  ].join(' ');

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto size-5" aria-hidden>
      <circle cx={CENTRE} cy={CENTRE} r={RADIUS} fill="var(--color-surface-overlay)" />
      <path
        d={lit}
        fill="#ffe2a0"
        transform={isWaning !== isSouthern ? `translate(${SIZE} 0) scale(-1 1)` : undefined}
      />
    </svg>
  );
};

export default MoonDisc;
