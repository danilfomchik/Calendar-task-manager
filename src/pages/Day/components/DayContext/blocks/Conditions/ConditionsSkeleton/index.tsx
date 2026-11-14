import {SkeletonLine} from '../../BlockCard';
import ConditionsFrame from '../ConditionsFrame';
import {DIAL_CENTRE, DIAL_CIRCUMFERENCE, DIAL_RADIUS, DIAL_RING_WIDTH, DIAL_SIZE} from '../dialGeometry';

// The loaded card in outline: an empty Dial with a short arc sweeping it, then lines where the facts land
const ConditionsSkeleton = () => (
  <ConditionsFrame busy>
    <span className="sr-only">Loading conditions</span>
    <div className="flex items-center gap-4">
      <svg
        viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}
        width={DIAL_SIZE}
        height={DIAL_SIZE}
        aria-hidden
        className="shrink-0 animate-[spin_1.4s_linear_infinite] motion-reduce:animate-none">
        <circle
          cx={DIAL_CENTRE}
          cy={DIAL_CENTRE}
          r={DIAL_RADIUS}
          fill="none"
          stroke="var(--color-surface-overlay)"
          strokeWidth={DIAL_RING_WIDTH}
        />
        <circle
          cx={DIAL_CENTRE}
          cy={DIAL_CENTRE}
          r={DIAL_RADIUS}
          fill="none"
          stroke="var(--color-info)"
          strokeOpacity="0.6"
          strokeWidth={DIAL_RING_WIDTH}
          strokeLinecap="round"
          strokeDasharray={`${DIAL_CIRCUMFERENCE * 0.18} ${DIAL_CIRCUMFERENCE}`}
        />
      </svg>
      <div className="flex flex-1 flex-col gap-3">
        <SkeletonLine className="h-3 w-3/4" />
        <SkeletonLine className="h-3 w-2/3" />
        <SkeletonLine className="h-3 w-1/2" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4 border-t border-line pt-3">
      <SkeletonLine className="h-9" />
      <SkeletonLine className="h-9" />
      <SkeletonLine className="h-9" />
    </div>
  </ConditionsFrame>
);

export default ConditionsSkeleton;
