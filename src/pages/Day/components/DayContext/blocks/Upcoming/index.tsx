import moment from 'moment';
import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router';

import {getDayCellLabel} from '@/pages/Day/helpers';
import {selectAllEventsByDate, selectEventsById} from '@/redux/events/selectors';
import {getCalendarColor} from '@/services/calendars';
import {formatEventsCount, getDayPath, getTodayKey} from '@/services/dateUtils';
import {calendarColorStyle} from '@/services/styles';

import {useDayContext} from '../../DayContextState';
import {DayContextBlock} from '../types';
import {UPCOMING_SCAN_DAYS, getUpcomingDays} from './getUpcomingDays';

const MAX_RELATIVE_DAYS = 7;

// "Tomorrow" / "in 3 days" for the coming week, counted from today (not from the Viewed day); else null
const getRelativeLabel = (date: string) => {
  const days = moment(date).diff(moment(getTodayKey()), 'days');

  if (days === 1) return 'Tomorrow';

  return days > 1 && days <= MAX_RELATIVE_DAYS ? `in ${days} days` : null;
};

// Upcoming: the next days with events after the Viewed day, as a timeline. Each day is a group of a few events in
// their calendars' colours; every link opens that day. Ignores the Calendar filter.
const Upcoming: DayContextBlock = ({date}) => {
  const eventsByDate = useSelector(selectAllEventsByDate);
  const eventsById = useSelector(selectEventsById);
  const {closeSheet} = useDayContext();

  const days = useMemo(() => getUpcomingDays(date, eventsByDate, eventsById), [date, eventsByDate, eventsById]);

  return (
    <section
      aria-labelledby="day-context-upcoming"
      className="flex flex-col gap-3 border border-line bg-surface-raised p-4">
      <h3 id="day-context-upcoming" className="font-mono text-[11px] tracking-widest text-text-faint uppercase">
        Upcoming
      </h3>
      {days.length ? (
        <ol className="ml-1 flex flex-col gap-4 border-l border-line-strong">
          {days.map(day => {
            const relative = getRelativeLabel(day.date);
            const hiddenCount = day.count - day.events.length;
            // on mobile the Bottom sheet stays open across day changes, so close it to reveal the day
            const linkProps = {to: getDayPath(day.date), onClick: closeSheet};

            return (
              <li key={day.date} className="relative flex flex-col gap-1.5 pl-4">
                <span aria-hidden className="absolute top-2.5 left-[-4.5px] size-2 bg-line-strong" />

                <Link
                  {...linkProps}
                  aria-label={getDayCellLabel(day.date, day.count)}
                  className="group flex min-h-7 flex-wrap items-baseline gap-x-2 focus-visible:-outline-offset-2">
                  <span className="font-display text-lg leading-none font-extrabold group-hover:text-action">
                    {moment(day.date).format('ddd D MMM')}
                  </span>
                  <span className="font-mono text-[11px] tracking-wider text-text-faint uppercase">
                    {relative ? `${relative} · ` : ''}
                    {formatEventsCount(day.count)}
                  </span>
                </Link>

                <ul className="flex flex-col gap-1">
                  {day.events.map(event => (
                    <li key={event.id}>
                      <Link
                        {...linkProps}
                        style={calendarColorStyle(getCalendarColor(event.eventCalendar))}
                        className="group flex min-h-9 items-stretch gap-2.5 border border-line bg-surface-base transition-colors hover:border-line-strong md:min-h-8 focus-visible:-outline-offset-2">
                        <span aria-hidden className="w-1 shrink-0 bg-(--calendar-color)" />
                        <span className="flex min-w-0 flex-1 flex-col justify-center py-1 pr-2">
                          <span className="truncate text-sm group-hover:text-action">{event.title}</span>
                          <span className="sr-only">{event.eventCalendar}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {hiddenCount > 0 && (
                  <Link
                    {...linkProps}
                    className="self-start font-mono text-[11px] tracking-wider text-text-faint uppercase underline-offset-2 hover:text-action hover:underline">
                    +{hiddenCount} more
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="font-mono text-xs text-text-faint">Nothing in the next {UPCOMING_SCAN_DAYS} days</p>
      )}
    </section>
  );
};

export default Upcoming;
