import CalendarMix from '@/components/common/CalendarMix';
import EventsTotal from '@/components/common/EventsTotal';
import DayHeading from '@/pages/Main/components/DayHeading';
import HolidayLine from '@/pages/Main/components/HolidayLine';

import {TAgendaHeaderProps} from './types';

// Agenda panel header: the day numeral beside the weekday (plus "Today") over "Month YYYY", as in the Day page's
// Viewed day cell (the header's Agenda toggle hides the panel); then the events total over the Calendar mix, then the Holiday line.
// Today's numeral is blue, as in the grid. An empty day reads "Free day" rather than "0 events", and its Calendar mix is
// left out (its height kept, so the header never jumps between empty and busy days): the default landing is today,
// often empty, and the first impression should not be a zero over a dashed line. The header is mounted only while the
// panel is open, so a closed panel never asks for the holiday.
const AgendaHeader = ({date, eventsCount}: TAgendaHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 border-b border-line px-5 pt-4 pb-5">
      <DayHeading date={date} size="panel" />

      <div className="flex flex-col gap-2.5">
        <EventsTotal count={eventsCount} emptyLabel="Free day" />
        {eventsCount > 0 ? <CalendarMix date={date} /> : <div aria-hidden className="h-0.75" />}
      </div>
      <HolidayLine date={date} />
    </div>
  );
};

export default AgendaHeader;
