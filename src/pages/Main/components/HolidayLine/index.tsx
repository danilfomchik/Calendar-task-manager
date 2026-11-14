import {useCallback, useId, useRef, useState} from 'react';

import AIInsightsBody from '@/components/common/AIInsightsBody';
import Popover from '@/components/common/Popover';

import HolidayLineChip from './HolidayLineChip';
import {THolidayLineProps} from './types';
import {useHolidayLine} from './useHolidayLine';

// Holiday line: the chip as a dialog trigger; selecting it opens the full AI insights answer in an editorial popover.
// Used in the Agenda panel and the Bottom sheet headers. Renders nothing (and reserves no space) when AI insights are
// off. The popover closes when the selected date changes, so it never shows another day's answer.
const HolidayLine = ({date, className}: THolidayLineProps) => {
  const {isEnabled, isLoading, insights, name} = useHolidayLine(date);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [openDate, setOpenDate] = useState(date);

  // a new date closes it (adjusting state while rendering, so it never paints open on the wrong day)
  if (openDate !== date) {
    setOpenDate(date);
    setIsOpen(false);
  }

  const close = useCallback(() => setIsOpen(false), []);

  if (!isEnabled) return null;

  const isShown = isOpen && !isLoading && !!insights;

  return (
    <>
      <HolidayLineChip
        ref={triggerRef}
        slotRef={slotRef}
        isLoading={isLoading}
        name={name}
        className={className}
        onClick={() => setIsOpen(open => !open)}
        aria-label={name ? `${name}, AI insights` : undefined}
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
          <AIInsightsBody insights={insights} variant="editorial" />
        </Popover>
      )}
    </>
  );
};

export default HolidayLine;
