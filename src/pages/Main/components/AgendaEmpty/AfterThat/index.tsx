import moment from 'moment';
import {useId, useMemo} from 'react';
import {useSelector} from 'react-redux';

import {selectAllEventsByDate, selectEventsById} from '@/redux/events/selectors';
import {getEventColor} from '@/services/calendars';
import {getDayCellLabel} from '@/services/dateUtils';
import {calendarColorStyle} from '@/services/styles';
import {getUpcomingDays} from '@/services/upcomingDays';

import {useShowDay} from '../useShowDay';
import {AFTER_THAT_LIMITS} from './constants';
import {TAfterThatProps} from './types';

// "After that": the next few days with events after the Next event's day, one row per day (date, then its first
// events in their calendars' colours), so a free day's body reads as the days ahead rather than a blank column.
// Selecting a row shows that day. Reads all events, so the Calendar filter has no effect, as with the Next event.
const AfterThat = ({after}: TAfterThatProps) => {
  const eventsByDate = useSelector(selectAllEventsByDate);
  const eventsById = useSelector(selectEventsById);
  const showDay = useShowDay();
  const headingId = useId();

  const days = useMemo(
    () => getUpcomingDays(after, eventsByDate, eventsById, AFTER_THAT_LIMITS),
    [after, eventsByDate, eventsById],
  );

  if (!days.length) return null;

  const year = moment().year();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h3 id={headingId} className="text-caption text-text-faint">
        After that
      </h3>
      <ol className="flex flex-col border-t border-line">
        {days.map(day => {
          const date = moment(day.date);
          const hiddenCount = day.count - day.events.length;

          return (
            <li key={day.date} className="border-b border-line">
              <button
                type="button"
                onClick={() => showDay(day.date)}
                aria-label={`${getDayCellLabel(day.date, day.count)}. Show that day`}
                className="group grid min-h-11 w-full cursor-pointer grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-3 py-2.5 text-left transition-colors hover:bg-surface-raised focus-visible:-outline-offset-2 motion-reduce:transition-none">
                <span className="pl-1 text-para-s text-text-muted tabular-nums transition-colors group-hover:text-action group-focus-visible:text-action motion-reduce:transition-none">
                  {date.format(date.year() === year ? 'ddd D MMM' : 'D MMM YYYY')}
                </span>
                <span aria-hidden className="flex min-w-0 flex-col gap-1 pr-1">
                  {day.events.map(event => (
                    <span
                      key={event.id}
                      style={calendarColorStyle(getEventColor(event))}
                      className="flex min-w-0 items-center gap-2">
                      <span className="size-1.5 shrink-0 rounded-full bg-(--calendar-color)" />
                      <span className="truncate text-para-s text-text">{event.title}</span>
                    </span>
                  ))}
                  {hiddenCount > 0 && <span className="pl-3.5 text-caption text-text-faint">+{hiddenCount} more</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default AfterThat;
