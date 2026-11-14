import {forwardRef} from 'react';

import SkeletonLine from '@/components/ui/SkeletonLine';
import {cx} from '@/services/utils';

import {THolidayLineProps} from './types';

// Holiday line: one reserved 32px row under the Agenda panel / Bottom sheet date. Skeleton while loading, the
// holiday name as an AI-insights chip when there is one, blank otherwise. Render it only while AI insights are
// enabled (see useHolidayLine) so no space is reserved when they are off.
// Hover/focus effects (sliding gradient edge, glows, sparkle, arrow) are motion-safe only; under reduced motion the
// chip keeps just the lighter fill and a static 1px green ring on focus.
const HolidayLine = forwardRef<HTMLButtonElement, THolidayLineProps>(
  ({isLoading, name, className, slotRef, ...buttonProps}, ref) => (
    // The slot is always mounted (while enabled) and focusable from script only, so focus has somewhere to land
    // when the chip it belonged to is replaced by the skeleton (e.g. the date changes with the popover open)
    <div
      ref={slotRef}
      tabIndex={-1}
      className={cx(
        'group/slot h-8 focus-visible:shadow-[0_0_0_1px_var(--color-action)] focus-visible:outline-none!',
        className,
      )}>
      {isLoading && (
        <div
          role="status"
          className="h-8 border border-line bg-surface-sunken p-2 group-focus-visible/slot:border-action">
          <span className="sr-only">Loading holiday</span>
          <SkeletonLine className="h-3.5 w-2/3" />
        </div>
      )}

      {!isLoading && name && (
        <button
          {...buttonProps}
          ref={ref}
          type="button"
          className="group block w-full cursor-pointer bg-linear-to-br from-info via-action to-info bg-size-[220%_220%] bg-position-[0%_0%] p-px text-left transition-[background-position,box-shadow] duration-500 focus-visible:shadow-[0_0_0_1px_var(--color-action)] focus-visible:outline-none! motion-safe:hover:bg-position-[100%_100%] motion-safe:hover:shadow-[0_0_18px_-4px_var(--color-action)] motion-safe:focus-visible:bg-position-[100%_100%] motion-safe:focus-visible:shadow-[0_0_0_1px_var(--color-action),0_0_18px_-4px_var(--color-action)]! motion-reduce:transition-none">
          <span className="relative flex h-7.5 items-center gap-2 overflow-hidden bg-surface-sunken px-2.5 transition-colors duration-300 group-hover:bg-surface-raised group-focus-visible:bg-surface-raised motion-reduce:transition-none">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-6 size-16 rounded-full bg-action/20 blur-2xl transition-all duration-500 motion-safe:group-hover:scale-150 motion-safe:group-hover:bg-action/35 motion-safe:group-focus-visible:scale-150 motion-safe:group-focus-visible:bg-action/35 motion-reduce:transition-none"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -left-6 size-16 rounded-full bg-info/20 blur-2xl transition-all duration-500 motion-safe:group-hover:scale-150 motion-safe:group-hover:bg-info/35 motion-safe:group-focus-visible:scale-150 motion-safe:group-focus-visible:bg-info/35 motion-reduce:transition-none"
            />
            <span
              aria-hidden
              className="relative text-xs text-action transition-transform duration-500 motion-safe:group-hover:scale-125 motion-safe:group-hover:rotate-180 motion-safe:group-focus-visible:scale-125 motion-safe:group-focus-visible:rotate-180 motion-reduce:transition-none">
              ✦
            </span>
            <span
              title={name}
              className="relative min-w-0 flex-1 truncate font-display text-sm leading-none font-extrabold">
              {name}
            </span>
            <span
              aria-hidden
              className="relative -translate-x-1 font-mono text-xs text-action opacity-0 transition-all duration-300 motion-safe:group-hover:translate-x-0 motion-safe:group-hover:opacity-100 motion-safe:group-focus-visible:translate-x-0 motion-safe:group-focus-visible:opacity-100 motion-reduce:hidden">
              ↗
            </span>
          </span>
        </button>
      )}
    </div>
  ),
);

HolidayLine.displayName = 'HolidayLine';

export default HolidayLine;
