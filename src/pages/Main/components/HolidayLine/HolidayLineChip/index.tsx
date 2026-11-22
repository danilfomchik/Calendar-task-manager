import {forwardRef} from 'react';

import SkeletonLine from '@/components/ui/SkeletonLine';
import {cx} from '@/services/utils';

import {THolidayLineChipProps} from './types';

// The Holiday line chip: one reserved 32px row under the Agenda panel / Bottom sheet date. Skeleton while loading, the
// holiday name as an AI-insights chip when there is one, a static rose error row with Retry when the request failed,
// blank otherwise. Render it only while AI insights are enabled (HolidayLine does) so no space is reserved when off.
// The ↗ is always visible so the chip reads as clickable. Lit (hover, keyboard focus or open, the `lit` variants in
// index.css) it turns green and the chip slides its gradient edge, grows the glows and rotates the sparkle, all of that
// motion-safe only; under reduced motion it keeps just the lighter fill, the green ↗ and a static 1px green focus
// ring. The error row shows a spinner and disables Retry while retrying. It is not a live region, so clicking through failing dates stays quiet.
const HolidayLineChip = forwardRef<HTMLButtonElement, THolidayLineChipProps>(
  ({status, onRetry, isRetrying = false, name, className, slotRef, ...buttonProps}, ref) => (
    // The slot is always mounted (while enabled) and focusable from script only, so focus has somewhere to land
    // when the chip it belonged to is replaced (e.g. the date changes with the popover open)
    <div
      ref={slotRef}
      tabIndex={-1}
      className={cx(
        'group/slot h-8 focus-visible:shadow-[0_0_0_1px_var(--color-action)] focus-visible:outline-none!',
        className,
      )}>
      {status === 'loading' && (
        // Same frame as the AI insights skeleton on the Day page (gradient edge, sunken fill, glows, sparkle) and the same geometry as the holiday chip, so the row doesn't shift when the name arrives
        <div role="status" className="h-8 bg-linear-to-br from-info via-action to-info p-px">
          <span className="sr-only">Loading AI insights</span>
          <span className="relative flex h-7.5 items-center gap-2 overflow-hidden bg-surface-sunken px-2.5">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-6 size-16 rounded-full bg-action/20 blur-2xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -left-6 size-16 rounded-full bg-info/20 blur-2xl"
            />
            <span aria-hidden className="relative text-xs text-action">
              ✦
            </span>
            <SkeletonLine className="relative h-3.5 w-2/3" />
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex h-8 items-center gap-2 border border-danger/40 bg-danger/5 pr-1 pl-2.5 text-sm text-danger group-focus-visible/slot:border-action">
          {isRetrying ? (
            <span
              aria-hidden
              className="size-3 shrink-0 animate-spin rounded-full border-2 border-danger/30 border-t-danger motion-reduce:animate-none"
            />
          ) : (
            <span aria-hidden className="text-xs">
              ⚠
            </span>
          )}
          <span className="min-w-0 flex-1 truncate">Couldn't load AI insights</span>
          {isRetrying && <span className="sr-only">Retrying</span>}
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="shrink-0 cursor-pointer px-1.5 py-0.5 font-mono text-[11px] tracking-widest text-danger uppercase transition-colors hover:text-text focus-visible:text-text focus-visible:shadow-[0_0_0_1px_var(--color-danger)] focus-visible:outline-none! disabled:cursor-default disabled:opacity-50 disabled:hover:text-danger motion-reduce:transition-none">
            Retry
          </button>
        </div>
      )}

      {status === 'holiday' && name && (
        <button
          {...buttonProps}
          ref={ref}
          type="button"
          className="group block w-full cursor-pointer bg-linear-to-br from-info via-action to-info bg-size-[220%_220%] bg-position-[0%_0%] p-px text-left transition-[background-position,box-shadow] duration-500 focus-visible:shadow-[0_0_0_1px_var(--color-action)] focus-visible:outline-none! motion-safe:lit:bg-position-[100%_100%] motion-safe:lit:shadow-[0_0_18px_-4px_var(--color-action)] motion-safe:focus-visible:shadow-[0_0_0_1px_var(--color-action),0_0_18px_-4px_var(--color-action)]! motion-reduce:transition-none">
          <span className="relative flex h-7.5 items-center gap-2 overflow-hidden bg-surface-sunken px-2.5 transition-colors duration-300 group-lit:bg-surface-raised motion-reduce:transition-none">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-6 size-16 rounded-full bg-action/20 blur-2xl transition-all duration-500 motion-safe:group-lit:scale-150 motion-safe:group-lit:bg-action/35 motion-reduce:transition-none"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -left-6 size-16 rounded-full bg-info/20 blur-2xl transition-all duration-500 motion-safe:group-lit:scale-150 motion-safe:group-lit:bg-info/35 motion-reduce:transition-none"
            />
            <span
              aria-hidden
              className="relative text-xs text-action transition-transform duration-500 motion-safe:group-lit:scale-125 motion-safe:group-lit:rotate-180 motion-reduce:transition-none">
              ✦
            </span>
            <span
              title={name}
              className="relative min-w-0 flex-1 truncate font-display text-sm leading-none font-extrabold">
              {name}
            </span>
            <span
              aria-hidden
              className="relative shrink-0 font-mono text-xs text-text-muted transition-colors duration-300 group-lit:text-action motion-reduce:transition-none">
              ↗
            </span>
          </span>
        </button>
      )}
    </div>
  ),
);

HolidayLineChip.displayName = 'HolidayLineChip';

export default HolidayLineChip;
