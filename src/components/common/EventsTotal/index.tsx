import {cx} from '@/services/utils';

import {TEventsTotalProps} from './types';

// Total events of a day: a display numeral with a small mono "events" label (Day summary, Agenda panel, Bottom sheet)
const EventsTotal = ({count, className}: TEventsTotalProps) => (
  <p className={cx('font-display text-2xl leading-none font-extrabold whitespace-nowrap', className)}>
    {count}{' '}
    <span className="font-mono text-xs font-normal tracking-widest text-text-faint uppercase">
      {count === 1 ? 'event' : 'events'}
    </span>
  </p>
);

export default EventsTotal;
