import {HAIRLINE_CONTROL_CLASS} from '@/services/styles';
import {cx} from '@/services/utils';

import {TChangeLocationButtonProps} from './types';

const ChangeLocationButton = ({name, isApproximate, onClick, autoFocus}: TChangeLocationButtonProps) => {
  const label = name && isApproximate ? `${name} · approx.` : name;
  const fullLabel = name && isApproximate ? `Near ${name} · approximate` : name;

  return (
    <div className="flex min-w-0 items-center gap-2">
      {label && (
        <span className="truncate text-xs text-text-muted" title={fullLabel ?? undefined}>
          {label}
        </span>
      )}
      <button
        type="button"
        autoFocus={autoFocus}
        onClick={onClick}
        aria-label={fullLabel ? `Change location (${fullLabel})` : 'Change location'}
        className={cx(HAIRLINE_CONTROL_CLASS, 'shrink-0 px-2 text-[10px] md:h-7 md:text-[10px]')}>
        Change
      </button>
    </div>
  );
};

export default ChangeLocationButton;
