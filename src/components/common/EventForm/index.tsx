import {yupResolver} from '@hookform/resolvers/yup';
import cn from 'classnames';
import moment from 'moment';
import {useMemo} from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import DropdownControl from '@/components/common/formInputs/DropdownControl';
import InputControl from '@/components/common/formInputs/InputControl';
import TextareaControl from '@/components/common/formInputs/TextareaControl';
import CheckIcon from '@/components/ui/icons/CheckIcon';
import CloseIcon from '@/components/ui/icons/CloseIcon';
import EditIcon from '@/components/ui/icons/EditIcon';
import {selectDay, selectMonth, selectYear} from '@/redux/date/selectors';
import {addEvent, editEvent} from '@/redux/events/eventsSlice';
import {useAppDispatch} from '@/redux/store';
import {createDate, formatDate, getDays, getMonthsOptions, getYearsOptions} from '@/services/dateUtils';
import {createEventObj, editEventObj} from '@/services/eventUtils';

import {validation} from './form';
import {FormActionType, TEventFormProps, TFormValues} from './types';

const EventForm = ({actionType = FormActionType.create, formTitle, event, date, handleModalClose}: TEventFormProps) => {
  const dispatch = useAppDispatch();
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);
  const day = useSelector(selectDay);

  const defaultValues = event
    ? {
        eventName: event.title,
        eventDescription: event.description,
        eventYear: formatDate(moment(event.date), 'YYYY'),
        eventMonth: formatDate(moment(event.date), 'MMMM'),
        eventDay: formatDate(moment(event.date), 'DD'),
      }
    : {
        eventName: '',
        eventYear: formatDate(moment(date), 'YYYY') || year || '',
        eventMonth: formatDate(moment(date), 'MMMM') || month || '',
        eventDay: formatDate(moment(date), 'DD') || day || '',
        eventDescription: '',
      };

  const methods = useForm<TFormValues>({
    resolver: yupResolver(validation),
    defaultValues,
    mode: 'onSubmit',
    shouldUnregister: false,
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: {errors, isDirty},
  } = methods;

  const formYearValue = watch('eventYear');
  const formMonthValue = watch('eventMonth');

  const yearsOptions = useMemo(() => getYearsOptions(), []);
  const monthsOptions = useMemo(() => getMonthsOptions(), []);
  const daysOptions = useMemo(
    () => getDays(formYearValue || '', formMonthValue || ''),
    [formYearValue, formMonthValue],
  );

  const handleCreateEvent = (eventData: TFormValues) => {
    const {eventName, eventYear, eventMonth, eventDay, eventDescription} = eventData;

    const newEvent = createEventObj({
      eventName,
      date: createDate(+eventYear, eventMonth, +eventDay),
      description: eventDescription,
    });

    dispatch(addEvent(newEvent));
  };

  const handleEditEvent = (eventData: TFormValues) => {
    const {eventName, eventYear, eventMonth, eventDay, eventDescription} = eventData;

    const editedEvent = editEventObj({
      event,
      updatedEvent: {
        eventName,
        date: createDate(+eventYear, eventMonth, +eventDay),
        description: eventDescription,
      },
    });

    dispatch(editEvent(editedEvent));
  };

  const onSubmit: SubmitHandler<TFormValues> = eventData => {
    if (actionType === 'create') {
      handleCreateEvent(eventData);
    } else {
      handleEditEvent(eventData);
    }

    handleModalClose();
  };

  return (
    <div>
      <Button
        startIcon={<CloseIcon size="size-5" />}
        className="absolute right-2 top-2 p-1 text-sm cursor-pointer hover:text-sky-500"
        onClick={handleModalClose}
      />

      <h3 className="text-lg font-bold p-3 text-center">{formTitle}</h3>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-between gap-[20px] w-auto px-[30px] py-[20px]">
            {!date && (
              <div className="flex gap-2 relative self-stretch max-md:flex-col">
                <DropdownControl control={control} options={monthsOptions} name="eventMonth" />
                <DropdownControl control={control} options={yearsOptions} name="eventYear" />
                <DropdownControl control={control} options={daysOptions} name="eventDay" />
              </div>
            )}

            <div className="w-full flex flex-col gap-2">
              <InputControl autoFocus control={control} name="eventName" placeholder="Enter required name" />
              <TextareaControl control={control} name="eventDescription" placeholder="Enter optional description" />
            </div>

            <Button
              className={cn(
                {
                  'border-sky-500 text-sky-500': isDirty,
                },
                'text-sm p-2 max-md:w-full',
              )}
              disabled={!isDirty || !!errors.eventName}
              text={actionType === FormActionType.edit ? 'Edit' : 'Create'}
              endIcon={actionType === FormActionType.edit ? <EditIcon size="size-4" /> : <CheckIcon size="size-4" />}
              type="submit"
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EventForm;
