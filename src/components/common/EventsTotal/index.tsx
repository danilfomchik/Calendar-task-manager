import {eventsNoun} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import {TEventsTotalProps} from './types';

// Total events of a day: a Figure in the Headline face with a small "events" label in the text face (Day page, Agenda
// panel, Bottom sheet). The empty label takes the same Figure, muted, so the slot keeps its voice and height.
const EventsTotal = ({count, className, emptyLabel}: TEventsTotalProps) => {
  if (count === 0 && emptyLabel) {
    return <p className={cx('font-headline text-figure whitespace-nowrap text-text-muted', className)}>{emptyLabel}</p>;
  }

  return (
    <p className={cx('font-headline text-figure whitespace-nowrap', className)}>
      {count} <span className="font-display text-caption text-text-faint">{eventsNoun(count)}</span>
    </p>
  );
};

export default EventsTotal;
