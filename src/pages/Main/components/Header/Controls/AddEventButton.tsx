import {useSelector} from 'react-redux';

import {selectSelectedDate} from '@/redux/date/selectors';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {FormActionType} from '@/types/eventFormTypes';

// solid green primary action of the home header
const AddEventButton = () => {
  const dispatch = useAppDispatch();
  const selectedDate = useSelector(selectSelectedDate);

  const handleOpen = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.create, date: selectedDate}));
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="ml-3 inline-flex h-9 cursor-pointer items-center justify-center gap-2 bg-action px-3 font-mono text-xs font-medium uppercase tracking-wider text-action-ink hover:brightness-110">
      + Add event
    </button>
  );
};

export default AddEventButton;
