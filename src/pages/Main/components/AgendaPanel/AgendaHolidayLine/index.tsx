import HolidayLine from '../../HolidayLine';
import {useHolidayLine} from '../../HolidayLine/useHolidayLine';
import {TAgendaHolidayLineProps} from './types';

// Mounted only while the Agenda panel is open, so a closed panel never asks for the holiday.
// Renders nothing (and reserves no space) when AI insights are off.
const AgendaHolidayLine = ({date, className}: TAgendaHolidayLineProps) => {
  const {isEnabled, isLoading, name} = useHolidayLine(date);

  if (!isEnabled) return null;

  return <HolidayLine isLoading={isLoading} name={name} className={className} />;
};

export default AgendaHolidayLine;
