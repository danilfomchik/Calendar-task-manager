import {PanInfo, motion} from 'motion/react';
import {ReactNode, useMemo} from 'react';
import {useSelector} from 'react-redux';

import {useGetDayConditionsQuery} from '@/redux/conditions/conditionsApi';
import {useGetDayHolidaysInfoQuery} from '@/redux/dateHolidaysGenerator/holidaysApi';
import {selectDayNote} from '@/redux/dayNotes/selectors';
import {selectAllEventsByDate, selectEventsById} from '@/redux/events/selectors';
import {getTodayKey} from '@/services/dateUtils';

import {useDayContext} from './DayContextState';
import {IS_AI_INSIGHTS_ENABLED} from './blocks/AIInsights/enabled';
import {parseAIContent} from './blocks/AIInsights/parseAIContent';
import {getConditionsSource} from './blocks/Conditions/conditionsRange';
import {useConditionsLocation} from './blocks/Conditions/useConditionsLocation';
import {describeWeatherCode} from './blocks/Conditions/weatherCode';
import {getUpcomingDays} from './blocks/Upcoming/getUpcomingDays';
import {DAY_CONTEXT_BUTTON_ID, DAY_CONTEXT_SHEET_ID} from './constants';

// An upward drag this long (px) or this fast (px/s) opens the sheet, like the sheet's own downward flick to close
const OPEN_DRAG_DISTANCE = 24;
const OPEN_FLICK_VELOCITY = 250;

const Chip = ({children}: {children: ReactNode}) => (
  <span className="shrink-0 border border-line bg-surface-base px-1.5 py-0.5 font-mono text-[11px] tracking-wide whitespace-nowrap text-text-muted">
    {children}
  </span>
);

// One chip per block that has something to show, with the real content: the day's weather (same query as the
// Conditions block, so cached), the events coming up, whether the day has a note, and whether insights arrived.
const useChips = (date: string) => {
  const source = getConditionsSource(date, getTodayKey());
  const {location} = useConditionsLocation(false);
  const {data: conditions} = useGetDayConditionsQuery(
    {date, latitude: location?.latitude ?? 0, longitude: location?.longitude ?? 0, source: source ?? 'forecast'},
    {skip: !source || !location},
  );
  const {data: holidays} = useGetDayHolidaysInfoQuery(date, {skip: !IS_AI_INSIGHTS_ENABLED});
  const eventsByDate = useSelector(selectAllEventsByDate);
  const eventsById = useSelector(selectEventsById);
  const note = useSelector(selectDayNote(date))?.trim();

  const upcomingCount = useMemo(
    () => getUpcomingDays(date, eventsByDate, eventsById).reduce((total, day) => total + day.count, 0),
    [date, eventsByDate, eventsById],
  );
  const hasInsights = IS_AI_INSIGHTS_ENABLED && !!parseAIContent(holidays?.choices?.[0]?.message?.content);

  const chips: {key: string; label: ReactNode}[] = [];

  if (conditions) {
    chips.push({
      key: 'weather',
      label: (
        <>
          <span aria-hidden>{describeWeatherCode(conditions.weatherCode).glyph}</span>{' '}
          {Math.round(conditions.temperatureMax)}°/{Math.round(conditions.temperatureMin)}°
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
          <span aria-hidden>📝</span> Note
        </>
      ),
    });
  if (hasInsights)
    chips.push({
      key: 'insights',
      label: (
        <>
          <span aria-hidden>✦</span> Insights
        </>
      ),
    });

  return chips;
};

// Mobile Context button (fills the bar to the left of the floating Add event). Closed, it is the top of the Bottom
// sheet peeking above the screen's bottom: a grab handle, the title with an up chevron and a chip per block that
// has something to show. A tap or an upward drag opens the sheet.
const ContextButton = ({date}: {date: string}) => {
  const {isSheetOpen, openSheet} = useDayContext();
  const chips = useChips(date);

  const onPanEnd = (_: PointerEvent, {offset, velocity}: PanInfo) => {
    if (offset.y < -OPEN_DRAG_DISTANCE || velocity.y < -OPEN_FLICK_VELOCITY) openSheet();
  };

  return (
    <motion.button
      id={DAY_CONTEXT_BUTTON_ID}
      type="button"
      aria-expanded={isSheetOpen}
      aria-controls={DAY_CONTEXT_SHEET_ID}
      aria-haspopup="dialog"
      onClick={openSheet}
      onPanEnd={onPanEnd}
      className="relative flex h-18 min-w-0 flex-1 cursor-pointer touch-none flex-col justify-end gap-1.5 border border-line-strong bg-surface-base px-3 pb-2.5 text-left shadow-lg active:bg-surface-overlay">
      <span aria-hidden className="absolute top-1.5 left-1/2 h-1 w-10 -translate-x-1/2 bg-line-strong" />
      <span className="flex items-center justify-between font-mono text-[11px] tracking-widest text-action uppercase">
        <span>
          <span aria-hidden>✦</span> Day context
        </span>
        <span aria-hidden className="text-base leading-none">
          ⌃
        </span>
      </span>
      <span className="flex min-h-6 w-full gap-1.5 overflow-hidden">
        {chips.length ? (
          chips.map(chip => <Chip key={chip.key}>{chip.label}</Chip>)
        ) : (
          <span className="font-mono text-[11px] tracking-wide text-text-faint">Weather · Upcoming · Note</span>
        )}
      </span>
    </motion.button>
  );
};

export default ContextButton;
