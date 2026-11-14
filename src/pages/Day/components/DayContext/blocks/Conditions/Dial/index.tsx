import {
  DIAL_CENTRE,
  DIAL_CIRCUMFERENCE,
  DIAL_FACE_INSET,
  DIAL_RADIUS,
  DIAL_RING_WIDTH,
  DIAL_SIZE,
  polar,
} from '../dialGeometry';
import {TDialProps} from './types';

// The Conditions instrument: the ring fills clockwise from 12 o'clock with the chance of rain, a pointer on it marks
// where the wind comes from, and the round face holds the Sky scene with the day's temperatures in the middle.
const Dial = ({rainChance, windDirection, face, children}: TDialProps) => {
  const centre = DIAL_CENTRE;
  const radius = DIAL_RADIUS;
  const circumference = DIAL_CIRCUMFERENCE;

  let pointer = null;
  if (windDirection !== null) {
    const [tipX, tipY] = polar(DIAL_SIZE, windDirection, radius - 7);
    const [leftX, leftY] = polar(DIAL_SIZE, windDirection - 7, radius + 5);
    const [rightX, rightY] = polar(DIAL_SIZE, windDirection + 7, radius + 5);

    pointer = `M ${tipX} ${tipY} L ${leftX} ${leftY} L ${rightX} ${rightY} Z`;
  }

  return (
    <div className="relative shrink-0" style={{width: DIAL_SIZE, height: DIAL_SIZE}}>
      <div className="absolute overflow-hidden rounded-full" style={{inset: DIAL_FACE_INSET}}>
        {face}
        {/* keeps the temperatures legible on any sky */}
        <div aria-hidden className="absolute inset-0 bg-radial from-black/45 to-transparent to-70%" />
      </div>
      <svg viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`} className="absolute inset-0" aria-hidden>
        <circle
          cx={centre}
          cy={centre}
          r={radius}
          fill="none"
          stroke="var(--color-surface-overlay)"
          strokeWidth={DIAL_RING_WIDTH}
        />
        {rainChance !== null && (
          <circle
            cx={centre}
            cy={centre}
            r={radius}
            fill="none"
            stroke="var(--color-info)"
            strokeWidth={DIAL_RING_WIDTH}
            strokeDasharray={`${(rainChance / 100) * circumference} ${circumference}`}
            transform={`rotate(-90 ${centre} ${centre})`}
          />
        )}
        {pointer && <path d={pointer} fill="var(--color-text)" />}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
};

export default Dial;
