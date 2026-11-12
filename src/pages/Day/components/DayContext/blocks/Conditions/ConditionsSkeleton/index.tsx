import {SkeletonLine} from '../../BlockCard';
import ConditionsFrame from '../ConditionsFrame';

const ConditionsSkeleton = () => (
  <ConditionsFrame busy>
    <span className="sr-only">Loading conditions</span>
    <div className="flex items-end justify-between gap-3">
      <SkeletonLine className="h-9 w-32" />
      <SkeletonLine className="size-8" />
    </div>
    <SkeletonLine className="h-3.5 w-1/2" />
    <div className="flex flex-col gap-2">
      {Array.from({length: 5}, (_, i) => (
        <SkeletonLine key={i} className="h-4.5 w-full" />
      ))}
    </div>
  </ConditionsFrame>
);

export default ConditionsSkeleton;
