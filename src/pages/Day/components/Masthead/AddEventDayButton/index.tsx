import {setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {FormActionType} from '@/types/eventFormTypes';

import {TAddEventDayButtonProps} from './types';

// Home's green Add event, bound to the Viewed day instead of the selected date.
// `floating` is the mobile square button; the Day page places it in the bottom-right floating stack.
const AddEventDayButton = ({date, floating = false}: TAddEventDayButtonProps) => {
  const dispatch = useAppDispatch();

  const handleOpen = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.create, date}));
  };

  if (floating) {
    return (
      <button
        type="button"
        aria-label="Add event"
        title="Add event"
        onClick={handleOpen}
        className="flex size-14 cursor-pointer items-center justify-center bg-action font-mono text-3xl font-medium text-action-ink shadow-lg active:brightness-110">
        +
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 bg-action px-3 font-mono text-xs font-medium tracking-wider text-action-ink uppercase hover:brightness-110">
      + Add event
    </button>
  );
};

export default AddEventDayButton;
