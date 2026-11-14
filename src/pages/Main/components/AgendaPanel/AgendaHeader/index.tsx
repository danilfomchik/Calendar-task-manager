import moment from 'moment';

import DayNote from '@/components/common/DayNote';

import AgendaHolidayLine from '../AgendaHolidayLine';
import {TAgendaHeaderProps} from './types';

// Agenda panel header (variant D): weekday, day number, "Month YYYY · N events", Holiday line, then the Day note row.
// The close button stays top-right. The Day note is keyed by date, so a pending draft is saved to its own day
// before the selected date changes (and when the panel closes).
const AgendaHeader = ({date, eventsCount, onClose}: TAgendaHeaderProps) => {
  const day = moment(date);

  return (
    <div className="border-b border-line">
      <div className="flex items-start gap-3 p-5 pb-4">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-widest text-text-faint">{day.format('dddd')}</p>
          <p className="font-display font-extrabold tracking-tight text-7xl leading-none text-text">
            {day.format('DD')}
          </p>
          <p className="font-mono mt-2 text-xs text-text-muted">
            {day.format('MMMM YYYY')} · {eventsCount} {eventsCount === 1 ? 'event' : 'events'}
          </p>
          <AgendaHolidayLine date={date} className="mt-2" />
        </div>

        <button
          type="button"
          aria-label="Close agenda"
          title="Close agenda"
          onClick={onClose}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center border border-line-strong font-mono text-text-muted transition-colors hover:text-text">
          ×
        </button>
      </div>

      <div className="px-5 pb-5">
        <DayNote date={date} />
      </div>
    </div>
  );
};

export default AgendaHeader;
