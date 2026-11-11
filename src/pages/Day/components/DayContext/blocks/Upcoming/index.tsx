import moment from 'moment';
import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router';

import {selectAllEventsByDate, selectEventsById} from '@/redux/events/selectors';

import {formatEventsCount, getDayCellLabel, getDayPath} from '../../../../helpers';
import {useDayContext} from '../../DayContextState';
import {DayContextBlock} from '../types';
import {UPCOMING_SCAN_DAYS, getUpcomingDays} from './getUpcomingDays';

// Upcoming: the next days with events after the Viewed day; each row opens that day. Ignores the Calendar filter.
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
        <ul className="flex flex-col">
          {days.map(day => (
            <li key={day.date} className="border-b border-line last:border-0">
              <Link
                to={getDayPath(day.date)}
                // on mobile the Bottom sheet stays open across day changes, so close it to reveal the day
                onClick={closeSheet}
                aria-label={`${getDayCellLabel(day.date, day.count)}, first: ${day.firstTitle}`}
                className="group flex min-h-11 w-full flex-col justify-center gap-0.5 py-1.5 transition-colors focus-visible:-outline-offset-2">
                <span className="font-mono text-[11px] tracking-wider text-text-faint uppercase">
                  {moment(day.date).format('ddd D MMM')} · {formatEventsCount(day.count)}
                </span>
                <span className="w-full truncate text-sm text-text group-hover:text-action">{day.firstTitle}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-mono text-xs text-text-faint">Nothing in the next {UPCOMING_SCAN_DAYS} days</p>
      )}
    </section>
  );
};

export default Upcoming;
