import {eventsNoun} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import {TEventsTotalProps} from './types';

// Total events of a day: a display numeral with a small mono "events" label (Day page, Agenda panel, Bottom sheet)
const EventsTotal = ({count, className}: TEventsTotalProps) => (
  <p className={cx('font-display text-2xl font-extrabold whitespace-nowrap', className)}>
    {count}{' '}
    <span className="font-mono text-xs font-normal tracking-widest text-text-faint uppercase">{eventsNoun(count)}</span>
  </p>
);

export default EventsTotal;
