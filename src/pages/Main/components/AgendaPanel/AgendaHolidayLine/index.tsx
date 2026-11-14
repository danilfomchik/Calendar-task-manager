import HolidayLinePopover from '../../HolidayLinePopover';
import {TAgendaHolidayLineProps} from './types';

// Mounted only while the Agenda panel is open, so a closed panel never asks for the holiday.
// Renders nothing (and reserves no space) when AI insights are off.
const AgendaHolidayLine = ({date, className}: TAgendaHolidayLineProps) => (
  <HolidayLinePopover date={date} className={className} />
);

export default AgendaHolidayLine;
