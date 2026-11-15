import EventsTotal from '@/components/common/EventsTotal';
import CalendarMix from '@/pages/Main/components/CalendarMix';
import DayHeading from '@/pages/Main/components/DayHeading';
import HolidayLine from '@/pages/Main/components/HolidayLine';

import {TAgendaHeaderProps} from './types';

// Agenda panel header: the day numeral beside the weekday (plus "Today") over "Month YYYY", as in the Day page's
// Viewed day cell, and the close button; then the events total over the Calendar mix, then the Holiday line.
// Today's numeral is blue, as in the grid. The header is mounted only while the panel is open, so a closed panel
// never asks for the holiday.
const AgendaHeader = ({date, eventsCount, onClose}: TAgendaHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 border-b border-line px-5 pt-4 pb-5">
      <DayHeading date={date} size="panel">
        <button
          type="button"
          aria-label="Close agenda"
          title="Close agenda"
          onClick={onClose}
          className="ml-auto flex size-8 shrink-0 cursor-pointer items-center justify-center self-start border border-line-strong font-mono text-text-muted transition-colors hover:text-text">
          ×
        </button>
      </DayHeading>

      <div className="flex flex-col gap-2.5">
        <EventsTotal count={eventsCount} className="leading-none" />
        <CalendarMix date={date} />
      </div>
      <HolidayLine date={date} />
    </div>
  );
};

export default AgendaHeader;
