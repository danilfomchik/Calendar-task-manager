import moment from 'moment';

import ArrowRight from '@/components/ui/icons/ArrowRight';
import {getEventColor} from '@/services/calendars';
import {calendarColorStyle} from '@/services/styles';

import {useShowDay} from '../useShowDay';
import {TNextEventLinkProps} from './types';

// "Next  ● Dentist  Fri 13 Nov  →", leading an empty day's body: the first event after it, so an empty day still points
// somewhere. Selecting it shows that day (useShowDay) and highlights the event's row.
const NextEventLink = ({event}: TNextEventLinkProps) => {
  const showDay = useShowDay();

  const day = moment(event.date);
  const isThisYear = day.isSame(moment(), 'year');
  const shortDate = day.format(isThisYear ? 'ddd D MMM' : 'ddd D MMM YYYY');
  const longDate = day.format(isThisYear ? 'dddd D MMMM' : 'dddd D MMMM YYYY');

  return (
    <button
      type="button"
      onClick={() => showDay(event.date, event.id)}
      aria-label={`Next event: ${event.title}, ${longDate}. Show that day`}
      title={`Show ${shortDate}`}
      style={calendarColorStyle(getEventColor(event))}
      className="group flex min-h-11 w-full cursor-pointer items-center gap-2.5 border border-line px-3 text-left transition-colors hover:border-line-strong hover:bg-surface-raised focus-visible:outline-offset-0! motion-reduce:transition-none">
      <span className="shrink-0 text-caption text-text-faint">Next</span>
      <span aria-hidden className="size-2 shrink-0 rounded-full bg-(--calendar-color)" />
      <span className="min-w-0 flex-1 truncate text-h6 text-text">{event.title}</span>
      <span className="shrink-0 text-caption text-text-muted">{shortDate}</span>
      <ArrowRight
        size="size-4"
        aria-hidden
        className="size-4 shrink-0 text-text-muted transition-[color,translate] duration-300 ease-out group-hover:text-action group-focus-visible:text-action motion-safe:group-hover:translate-x-0.5"
      />
    </button>
  );
};

export default NextEventLink;
