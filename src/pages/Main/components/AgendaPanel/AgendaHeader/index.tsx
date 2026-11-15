import moment from 'moment';

import EventsTotal from '@/components/common/EventsTotal';
import {getTodayKey} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import CalendarMix from '../../CalendarMix';
import HolidayLine from '../../HolidayLine';
import {TAgendaHeaderProps} from './types';

// Agenda panel header: the day numeral beside the weekday (plus "Today") over "Month YYYY", as in the Day page's
// Viewed day cell, and the close button; then the events total over the Calendar mix, then the Holiday line.
// Today's numeral is blue, as in the grid. The header is mounted only while the panel is open, so a closed panel
// never asks for the holiday.
const AgendaHeader = ({date, eventsCount, onClose}: TAgendaHeaderProps) => {
  const day = moment(date);
  const isToday = date === getTodayKey();

  return (
    <div className="flex flex-col gap-4 border-b border-line px-5 pt-4 pb-5">
      <div className="flex items-end gap-4">
        <span
          className={cx(
            'font-display text-[88px] leading-[0.78] font-extrabold tracking-[-0.04em] tabular-nums',
            isToday ? 'text-info' : 'text-text',
          )}>
          {day.format('DD')}
        </span>

        <div className="flex min-w-0 flex-col">
          <span className="flex items-baseline gap-2">
            <span className="truncate text-xl leading-tight font-semibold">{day.format('dddd')}</span>
            {isToday && <span className="font-mono text-xs font-medium tracking-wider text-info uppercase">Today</span>}
          </span>
          <span className="truncate text-sm text-text-muted">{day.format('MMMM YYYY')}</span>
        </div>

        <button
          type="button"
          aria-label="Close agenda"
          title="Close agenda"
          onClick={onClose}
          className="ml-auto flex size-8 shrink-0 cursor-pointer items-center justify-center self-start border border-line-strong font-mono text-text-muted transition-colors hover:text-text">
          ×
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        <EventsTotal count={eventsCount} />
        <CalendarMix date={date} />
      </div>
      <HolidayLine date={date} />
    </div>
  );
};

export default AgendaHeader;
