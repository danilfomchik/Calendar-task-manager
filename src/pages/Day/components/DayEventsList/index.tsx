import {useSelector} from 'react-redux';

import {useEventsList} from '@/hooks/useEventsList';
import {useOpenEventForm} from '@/hooks/useOpenEventForm';
import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';

import DayEvent from './DayEvent';
import {TDayEventsListProps} from './types';

// Events of the Viewed day. The Calendar filter dims events (Dimmed event), it never hides them.
const DayEventsList = ({date}: TDayEventsListProps) => {
  const {openCreate} = useOpenEventForm();
  const activeCalendars = useSelector(selectActiveCalendars);
  const events = useEventsList(date);

  if (!events?.length) {
    return (
      <p className="text-para-s text-text-faint">
        No events{' '}
        <button
          type="button"
          onClick={() => openCreate(date)}
          className="cursor-pointer text-action underline underline-offset-2">
          Add event
        </button>
      </p>
    );
  }

  return (
    <ul aria-label="Events" className="flex flex-col gap-1.5">
      {events.map(event => (
        <DayEvent key={event.id} event={event} isDimmed={isEventDimmed(activeCalendars, event.eventCalendar)} />
      ))}
    </ul>
  );
};

export default DayEventsList;
