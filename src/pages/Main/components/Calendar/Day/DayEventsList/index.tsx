import {useCallback, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import {useMeasure} from '@/hooks/useMeasure';
import {useAgendaPanelActions} from '@/pages/Main/AgendaPanelContext';
import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';
import {remToPx} from '@/services/dom';
import {cx} from '@/services/utils';

import Event from './Event';
import EventBar from './EventBar';
import {TDayEventsListProps} from './types';
import {useCoarsePointer} from './useCoarsePointer';

// In rem, like the caption inside them, so a raised browser font size grows chips and gaps with the text instead of
// clipping it. At the default 16px root: 18px chips (the 12px caption, leading-none, with 3px above and below) and 2px
// gaps. On a coarse pointer (a touch tablet in the desktop layout) chips are 24px tall, the WCAG 2.5.8 minimum target,
// so fewer fit and more fall into "+N more". Every slot is a chip; "+N more" sits in the numeral row.
const EVENT_HEIGHT_REM = 1.125;
const EVENT_HEIGHT_COARSE_REM = 1.5;
const EVENT_GAP_REM = 0.125;

// Bars (a cell too narrow for readable chips, see useCompactCells): chip miniatures with 2px gaps that fill the cell's
// height. 7px is a bar's minimum, so it sets how many fit; the bars then share the free height (EventBar grows up to a
// chip's height), so a busy day fills the cell instead of stopping halfway and a quiet day is a chip-sized tile, not a
// sliver. The rest go to "+N" as with chips.
const BAR_HEIGHT_REM = 0.4375;
const BAR_GAP_REM = 0.125;

const DayEventsList = ({events, date, variant = 'chips', className}: TDayEventsListProps) => {
  const {openFor} = useAgendaPanelActions();
  const activeCalendars = useSelector(selectActiveCalendars);
  const eventsCount = events.length;
  const isBars = variant === 'bars';
  const isCoarsePointer = useCoarsePointer();
  const eventHeightRem = isBars ? BAR_HEIGHT_REM : isCoarsePointer ? EVENT_HEIGHT_COARSE_REM : EVENT_HEIGHT_REM;
  const eventGapRem = isBars ? BAR_GAP_REM : EVENT_GAP_REM;

  // with a Calendar filter on, matching events come first (stable, so each group keeps its order) and the Dimmed ones
  // are the ones that fall into "+N more"
  const orderedEvents = useMemo(
    () =>
      activeCalendars.length === 0
        ? events
        : [...events].sort(
            (a, b) =>
              Number(isEventDimmed(activeCalendars, a.eventCalendar)) -
              Number(isEventDimmed(activeCalendars, b.eventCalendar)),
          ),
    [activeCalendars, events],
  );

  const [slots, setSlots] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // read the root size on every measure: a font size change resizes the cell (its numeral row is in rem too), so the
  // observer fires with the new size in effect
  const measureSlots = useCallback(
    (container: HTMLDivElement) => {
      const eventHeight = remToPx(eventHeightRem);
      const eventGap = remToPx(eventGapRem);
      const {paddingTop, paddingBottom} = getComputedStyle(container);
      const height = container.clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);

      setSlots(Math.max(0, Math.floor((height + eventGap) / (eventHeight + eventGap))));
    },
    [eventHeightRem, eventGapRem],
  );

  useMeasure(containerRef, measureSlots);

  const visibleEventsCount = Math.min(slots, eventsCount);
  const hiddenEventsCount = eventsCount - visibleEventsCount;
  const hasOverflow = hiddenEventsCount > 0;

  return (
    <div
      ref={containerRef}
      className={cx('flex flex-col w-full flex-1 min-h-(--event-height) overflow-hidden', {'p-1': isBars}, className)}
      style={{'--event-height': `${eventHeightRem}rem`, rowGap: `${eventGapRem}rem`} as React.CSSProperties}>
      {orderedEvents
        .slice(0, visibleEventsCount)
        .map(event =>
          isBars ? (
            <EventBar key={event.id} event={event} isDisabled={isEventDimmed(activeCalendars, event.eventCalendar)} />
          ) : (
            <Event
              key={event.id}
              event={event}
              date={date}
              isDisabled={isEventDimmed(activeCalendars, event.eventCalendar)}
            />
          ),
        )}

      {hasOverflow && (
        // In the numeral row's free right side (positioned against the cell, so the list's overflow doesn't clip it), so
        // it never takes a chip's slot. Out of the tab order like the chips: the Agenda panel lists every event of the
        // selected day. Below a 7rem cell only "+N" shows.
        <Button
          tabIndex={-1}
          aria-label={`Show all ${eventsCount} events`}
          title="Show all events for this day"
          onClick={e => {
            e.stopPropagation();
            openFor(date);
          }}
          className={cx(
            'absolute top-1.5 h-7',
            // the cell's side padding: 4px in the bar layout, 6px with chips
            isBars ? 'right-1' : 'right-1.5',
            'p-0 px-1 text-caption leading-none text-text-muted hover:text-text bg-transparent border-none rounded-none',
          )}
          text={
            <>
              +{hiddenEventsCount}
              <span className="@max-[7rem]:hidden"> more</span>
            </>
          }
        />
      )}
    </div>
  );
};

export default DayEventsList;
