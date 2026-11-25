import {forwardRef} from 'react';

import SkeletonLine from '@/components/ui/SkeletonLine';
import ArrowRight from '@/components/ui/icons/ArrowRight';
import WarningIcon from '@/components/ui/icons/WarningIcon';
import {shortHolidayRegion} from '@/redux/dateHolidaysGenerator/parseAIContent';
import {cx} from '@/services/utils';

import {THolidayLineChipProps} from './types';

// The Holiday line chip: one reserved 32px row under the Agenda panel / Bottom sheet date. Skeleton (with the chip's
// "AI ·" label, so it reads as AI output loading) while loading, the holiday name as a hairline chip when there is one
// (labelled "AI · <region>"), a static rose error row with Retry when the request failed, blank otherwise. Render it only while AI insights are enabled (HolidayLine does) so no space is reserved when off.
// The arrow is always visible so the chip reads as clickable. Lit (hover, keyboard focus or open, the `lit` variants in
// index.css) the chip takes the raised fill, the arrow turns green and nudges right, and a green hairline draws across
// its foot; under reduced motion the same states appear without the movement. Keyboard focus adds the global 2px green
// outline (index.css), as on Retry. The error row shows a spinner while retrying and Retry does nothing until it settles; Retry is aria-disabled,
// not disabled, so keyboard focus stays on it (HolidayLine moves focus on once the row goes away). Its message is announced through a polite
// status region that stays mounted with the slot (a region inserted together with its text is often missed); the
// line only fails after the date has settled, so clicking through failing dates announces once, not per click.
const HolidayLineChip = forwardRef<HTMLButtonElement, THolidayLineChipProps>(
  ({status, onRetry, isRetrying = false, name, region = null, className, slotRef, ...buttonProps}, ref) => (
    // The slot is always mounted (while enabled) and focusable from script only, so focus has somewhere to land
    // when the chip it belonged to is replaced (e.g. the date changes with the popover open)
    <div
      ref={slotRef}
      tabIndex={-1}
      className={cx(
        'group/slot h-8 focus-visible:shadow-[0_0_0_1px_var(--color-action)] focus-visible:outline-none!',
        className,
      )}>
      <span role="status" aria-live="polite" className="sr-only">
        {status === 'loading' && 'Loading AI insights'}
        {status === 'error' && (isRetrying ? 'Retrying AI insights' : "Couldn't load AI insights")}
      </span>

      {status === 'loading' && (
        // the chip's own "AI" label stays put while the name pulses in, so the row reads as the AI line loading
        // rather than an unlabelled grey bar; "Loading AI insights" is announced by the status region above, which
        // stays mounted, so the skeleton itself is hidden from screen readers
        <div
          aria-hidden
          className="flex h-8 items-center gap-2 border border-line bg-surface-sunken px-2.5 group-focus-visible/slot:border-action">
          <span className="shrink-0 text-caption text-text-faint">AI ·</span>
          <SkeletonLine className="h-3 w-1/2" />
        </div>
      )}

      {status === 'error' && (
        <div className="flex h-8 items-center gap-2 border border-danger/40 bg-danger/5 pr-1 pl-2.5 text-para-s text-danger group-focus-visible/slot:border-action">
          {isRetrying ? (
            <span
              aria-hidden
              className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-danger/30 border-t-danger progress-pulse"
            />
          ) : (
            <WarningIcon className="size-3.5 shrink-0" />
          )}
          {/* read from the status region above, so it is not heard twice */}
          <span aria-hidden className="min-w-0 flex-1 truncate">
            Couldn't load AI insights
          </span>
          <button
            type="button"
            onClick={isRetrying ? undefined : onRetry}
            aria-disabled={isRetrying || undefined}
            aria-label="Retry loading AI insights"
            // the pseudo-element widens the 24px Retry into a 44px touch target without growing the 32px row
            className="relative shrink-0 cursor-pointer px-1.5 py-0.5 before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] text-para-s text-danger transition-colors hover:text-text focus-visible:text-text focus-visible:outline-offset-0! aria-disabled:cursor-default aria-disabled:opacity-50 aria-disabled:hover:text-danger motion-reduce:transition-none">
            Retry
          </button>
        </div>
      )}

      {status === 'holiday' && name && (
        <button
          {...buttonProps}
          ref={ref}
          type="button"
          className="group relative flex h-8 w-full cursor-pointer items-center gap-2 overflow-hidden border border-line-strong bg-surface-sunken px-2.5 text-left transition-colors lit:border-text-muted lit:bg-surface-raised">
          {/* AI-sourced and not tied to the user's country, so the label says so and names whose holiday it is
              ("AI · Japan"), never a bare "Holiday" */}
          <span className="max-w-[40%] shrink-0 truncate text-caption text-text-faint">
            {shortHolidayRegion(region) ? `AI · ${shortHolidayRegion(region)}` : 'AI'}
          </span>
          <span title={name} className="min-w-0 flex-1 truncate text-h6">
            {name}
          </span>
          <ArrowRight
            size="size-4"
            aria-hidden
            className="size-4 shrink-0 text-text-muted transition-[color,translate] duration-300 ease-out group-lit:text-action motion-safe:group-lit:translate-x-0.5"
          />
          {/* the one moment: a green hairline draws across the foot of the chip when it is lit */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-action transition-transform duration-300 ease-out group-lit:scale-x-100"
          />
        </button>
      )}
    </div>
  ),
);

HolidayLineChip.displayName = 'HolidayLineChip';

export default HolidayLineChip;
