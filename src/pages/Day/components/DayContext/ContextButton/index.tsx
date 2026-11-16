import {MouseEvent, PointerEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import {useGetDayConditionsQuery} from '@/redux/conditions/conditionsApi';
import {useAIInsights} from '@/redux/dateHolidaysGenerator/useAIInsights';
import {selectDayNote} from '@/redux/dayNotes/selectors';
import {selectAllEventsByDate, selectEventsById} from '@/redux/events/selectors';
import {cx} from '@/services/utils';

import {useDayContext} from '../DayContextState';
import {getConditionsSourceForToday} from '../blocks/Conditions/conditionsRange';
import {useConditionsLocation} from '../blocks/Conditions/useConditionsLocation';
import {describeWeatherCode} from '../blocks/Conditions/weatherCode';
import {getUpcomingDays} from '../blocks/Upcoming/getUpcomingDays';
import {DAY_CONTEXT_BUTTON_ID, DAY_CONTEXT_SHEET_ID} from '../constants';
import {InsightIcon, NoteIcon, PanelBottomIcon} from '../icons';
import {TChipProps, TContextButtonProps} from './types';

// A click that ends this far (px) from where the pointer went down is the tail of a drag, not a tap
const TAP_SLOP = 8;

const Chip = ({children}: TChipProps) => (
  <span className="inline-flex shrink-0 items-center gap-1.5 border border-line bg-surface-raised px-2 py-0.5 font-mono text-[11px] leading-4 tracking-wide whitespace-nowrap text-text-muted">
    {children}
  </span>
);

// One chip per block that has something to show, with the real content: the day's weather (same query as the
// Conditions block, so cached), the events coming up, whether the day has a note, and whether insights arrived.
const useChips = (date: string) => {
  const source = getConditionsSourceForToday(date);
  const {location} = useConditionsLocation(false);
  const {data: conditions} = useGetDayConditionsQuery(
    {date, latitude: location?.latitude ?? 0, longitude: location?.longitude ?? 0, source: source ?? 'forecast'},
    {skip: !source || !location},
  );
  const {insights} = useAIInsights(date);
  const eventsByDate = useSelector(selectAllEventsByDate);
  const eventsById = useSelector(selectEventsById);
  const note = useSelector(selectDayNote(date))?.trim();

  const upcomingCount = useMemo(
    () => getUpcomingDays(date, eventsByDate, eventsById).reduce((total, day) => total + day.count, 0),
    [date, eventsByDate, eventsById],
  );
  const hasInsights = !!insights;

  const chips: {key: string; label: ReactNode}[] = [];

  if (conditions) {
    chips.push({
      key: 'weather',
      label: (
        <>
          <span aria-hidden>{describeWeatherCode(conditions.weatherCode).glyph}</span>
          {Math.round(conditions.temperatureMin)}°/{Math.round(conditions.temperatureMax)}°
        </>
      ),
    });
  }

  if (upcomingCount) chips.push({key: 'upcoming', label: `${upcomingCount} upcoming`});
  if (note)
    chips.push({
      key: 'note',
      label: (
        <>
          <NoteIcon className="text-action" /> Note
        </>
      ),
    });
  if (hasInsights)
    chips.push({
      key: 'insights',
      label: (
        <>
          <InsightIcon className="text-action" /> Insights
        </>
      ),
    });

  return chips;
};

// Mobile Context button (fills the bar to the left of the floating Add event). Closed, it is the top of the Bottom
// sheet peeking above the screen's bottom: a grab handle, the title and a chip per block that
// has something to show. A tap opens the sheet; an upward drag pulls it up under the finger; the chips swipe sideways.
const ContextButton = ({date}: TContextButtonProps) => {
  const {isSheetOpen, openSheet, sheetDragControls} = useDayContext();
  const pointerDownYRef = useRef(0);
  const chips = useChips(date);
  const chipsRef = useRef<HTMLSpanElement>(null);
  // the right-edge fade only shows while more chips are hidden past it
  const [hasMore, setHasMore] = useState(false);

  const updateHasMore = useCallback(() => {
    const el = chipsRef.current;
    if (el) setHasMore(el.scrollWidth - el.clientWidth - el.scrollLeft > 1);
  }, []);

  useEffect(() => {
    const el = chipsRef.current;
    if (!el) return;
    updateHasMore();
    const observer = new ResizeObserver(updateHasMore);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateHasMore, chips.length]);

  // The sheet follows the finger from the first move and settles by flick or half way, like when it closes
  const onPointerDown = (e: PointerEvent) => {
    pointerDownYRef.current = e.clientY;
    sheetDragControls?.start(e);
  };

  const onClick = (e: MouseEvent) => {
    if (Math.abs(e.clientY - pointerDownYRef.current) > TAP_SLOP) return;

    openSheet();
  };

  return (
    <button
      id={DAY_CONTEXT_BUTTON_ID}
      type="button"
      aria-expanded={isSheetOpen}
      aria-controls={DAY_CONTEXT_SHEET_ID}
      aria-haspopup="dialog"
      onPointerDown={onPointerDown}
      onClick={onClick}
      className="relative flex h-14 min-w-0 flex-1 cursor-pointer touch-pan-x flex-col justify-end gap-1 border border-line-strong bg-surface-base px-3 pb-1.5 text-left shadow-lg active:bg-surface-overlay">
      <span aria-hidden className="absolute top-1 left-1/2 h-0.75 w-8 -translate-x-1/2 bg-line-strong" />
      <span className="flex items-center gap-2 font-mono text-[11px] leading-none tracking-widest text-action uppercase">
        <PanelBottomIcon />
        Day context
      </span>
      <span
        ref={chipsRef}
        onScroll={updateHasMore}
        className={cx('flex min-h-5.5 w-full gap-1.5 overflow-x-auto overscroll-x-contain scrollbar-none', {
          'mask-[linear-gradient(to_right,#000_calc(100%-24px),transparent)]': hasMore,
        })}>
        {chips.length ? (
          chips.map(chip => <Chip key={chip.key}>{chip.label}</Chip>)
        ) : (
          <span className="font-mono text-[11px] tracking-wide text-text-faint">Weather, upcoming, note</span>
        )}
      </span>
    </button>
  );
};

export default ContextButton;
