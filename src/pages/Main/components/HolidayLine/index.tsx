import {useCallback, useEffect, useId, useRef, useState} from 'react';

import AIInsightsBody from '@/components/common/AIInsightsBody';
import Popover from '@/components/common/Popover';
import {describeHolidayRegion} from '@/redux/dateHolidaysGenerator/parseAIContent';

import HolidayLineChip from './HolidayLineChip';
import {THolidayLineProps} from './types';
import {useHolidayLine} from './useHolidayLine';

// Holiday line: the chip as a dialog trigger; selecting it opens the full AI insights answer in an editorial popover.
// Used in the Agenda panel and the Bottom sheet headers. Renders nothing (and reserves no space) when AI insights are
// off. The popover closes when the selected date changes, so it never shows another day's answer.
const HolidayLine = ({date, className}: THolidayLineProps) => {
  const {isEnabled, status, insights, name, isRetrying, retry} = useHolidayLine(date);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();
  const region = insights?.holiday?.region ?? null;
  const regionText = describeHolidayRegion(region);

  const [isOpen, setIsOpen] = useState(false);
  const [openDate, setOpenDate] = useState(date);

  // a new date closes it (adjusting state while rendering, so it never paints open on the wrong day)
  if (openDate !== date) {
    setOpenDate(date);
    setIsOpen(false);
  }

  const close = useCallback(() => setIsOpen(false), []);

  // Retry keeps keyboard focus while it spins (it is aria-disabled, not disabled), but a successful retry replaces the
  // error row, so focus would fall to the page. Hand it to what replaced the row: the chip, or the slot when blank.
  const isRetryFocusedRef = useRef(false);

  const handleRetry = () => {
    isRetryFocusedRef.current = !!slotRef.current?.contains(document.activeElement);
    retry();
  };

  useEffect(() => {
    if (!isRetryFocusedRef.current || isRetrying) return;

    isRetryFocusedRef.current = false;
    // still the error row: the retry failed and Retry kept its focus
    if (status === 'error') return;

    (status === 'holiday' ? triggerRef.current : slotRef.current)?.focus({preventScroll: true});
  }, [status, isRetrying]);

  if (!isEnabled) return null;

  const isShown = isOpen && status === 'holiday' && !!insights;

  return (
    <>
      <HolidayLineChip
        ref={triggerRef}
        slotRef={slotRef}
        status={status}
        onRetry={handleRetry}
        isRetrying={isRetrying}
        name={name}
        region={region}
        className={className}
        onClick={() => setIsOpen(open => !open)}
        aria-label={name ? `${name}${regionText ? `, o${regionText.slice(1)}` : ''}, AI insights` : undefined}
        aria-haspopup="dialog"
        aria-expanded={isShown}
        aria-controls={isShown ? popoverId : undefined}
      />
      {insights && (
        <Popover
          isOpen={isShown}
          anchorRef={triggerRef}
          fallbackFocusRef={slotRef}
          onClose={close}
          id={popoverId}
          label={name ? `AI insights: ${name}` : 'AI insights'}
          className="flex flex-col gap-3">
          <AIInsightsBody insights={insights} variant="popover" />
        </Popover>
      )}
    </>
  );
};

export default HolidayLine;
