import Button from '@/components/common/Button';
import PlusIcon from '@/components/ui/icons/PlusIcon';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';

const AddEvent = ({date, showText = true, className}: {date?: string; showText?: boolean; className?: string}) => {
  const dispatch = useAppDispatch();

  const handleOpen = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.create, date}));
  };

  return (
    <Button
      variant="secondary"
      text={showText ? 'Add event' : undefined}
      startIcon={<PlusIcon size="size-4" />}
      onClick={handleOpen}
      className={cx('text-sm py-2 px-3 max-md:w-full', className)}
    />
  );
};

export default AddEvent;
