import {useSelector} from 'react-redux';

import {useEventsList} from '@/hooks/useEventsList';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {FormActionType} from '@/types/eventFormTypes';

import DayEvent from './DayEvent';

// Events of the Viewed day. The Calendar filter dims events (Dimmed event), it never hides them.
const DayEventsList = ({date}: {date: string}) => {
  const dispatch = useAppDispatch();
  const activeCalendars = useSelector(selectActiveCalendars);
  const events = useEventsList(date);

  const handleAdd = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.create, date}));
  };

  if (!events?.length) {
    return (
      <p className="font-mono text-xs text-text-faint">
        No events{' '}
        <button type="button" onClick={handleAdd} className="cursor-pointer text-action underline underline-offset-2">
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
