import {cx} from '@/services/utils';

import {TMixBarProps} from './types';

// Event mix: one segment per event in its calendar colour; an empty day is a dashed line
const MixBar = ({colors, tall = false}: TMixBarProps) => {
  if (!colors.length) {
    return <span aria-hidden className="block h-1.5 w-full border-t border-dashed border-line-strong" />;
  }

  return (
    <span aria-hidden className={cx('flex w-full gap-0.5', tall ? 'h-1.5' : 'h-1')}>
      {colors.map((color, i) => (
        <span
          key={i}
          className="flex-1 bg-(--segment-color)"
          style={{'--segment-color': color} as React.CSSProperties}
        />
      ))}
    </span>
  );
};

export default MixBar;
