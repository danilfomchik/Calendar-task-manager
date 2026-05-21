import {yupResolver} from '@hookform/resolvers/yup';
import classNames from 'classnames';
import moment from 'moment';
import {useCallback, useMemo} from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import DropdownControl from '@/components/common/formInputs/DropdownControl';
import InputControl from '@/components/common/formInputs/InputControl';
import TextareaControl from '@/components/common/formInputs/TextareaControl';
import CloseIcon from '@/components/ui/icons/CloseIcon';
import EditIcon from '@/components/ui/icons/EditIcon';
import PlusIcon from '@/components/ui/icons/PlusIcon';
import {selectDay, selectMonth, selectYear} from '@/redux/date/selectors';
import {addEvent, editEvent} from '@/redux/events/eventsSlice';
import {selectSelectedCalendar} from '@/redux/myCalendars/selectors';
import {useAppDispatch} from '@/redux/store';
import {defaultCalendars} from '@/services/constants';
import {createDate, formatDate, getDays, getMonthsOptions, getYearsOptions} from '@/services/dateUtils';
import {createEventObj, editEventObj} from '@/services/eventUtils';
import {CalendarsNames} from '@/services/types';

import {validation} from './form';
import {FormActionType, TEventFormProps, TFormValues} from './types';

// TODO:
// 1. change styles for mobile version

const EventForm = ({actionType = FormActionType.create, formTitle, event, date, handleModalClose}: TEventFormProps) => {
  const dispatch = useAppDispatch();
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);
  const day = useSelector(selectDay);
  const selectedCalendar = useSelector(selectSelectedCalendar);

  const defaultValues = {
    eventTitle: event?.title ?? '',
    eventDescription: event?.description ?? '',
    eventYear: formatDate(moment(event?.date || date), 'YYYY') || year || '',
    eventMonth: formatDate(moment(event?.date || date), 'MMMM') || month || '',
    eventDay: formatDate(moment(event?.date || date), 'DD') || day || '',
    eventCalendar: event?.eventCalendar ?? CalendarsNames.personal,
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
  const calendarOptions = Object.values(CalendarsNames);

  const handleCreateEvent = (eventData: TFormValues) => {
    const {eventTitle, eventYear, eventMonth, eventDay, eventDescription, eventCalendar} = eventData;

    const newEvent = createEventObj({
      title: eventTitle,
      date: createDate(+eventYear, eventMonth, +eventDay),
      description: eventDescription,
      eventCalendar,
      isDisabled: !selectedCalendar ? false : selectedCalendar !== eventCalendar,
    });

    dispatch(addEvent(newEvent));
  };

  const handleEditEvent = (eventData: TFormValues) => {
    const {eventTitle, eventYear, eventMonth, eventDay, eventDescription, eventCalendar} = eventData;

    const editedEvent = editEventObj({
      event,
      updatedEvent: {
        title: eventTitle,
        date: createDate(+eventYear, eventMonth, +eventDay),
        description: eventDescription,
        eventCalendar,
        isDisabled: !selectedCalendar ? event?.isDisabled || false : selectedCalendar !== eventCalendar,
      },
    });

    dispatch(editEvent({oldEvent: event!, newEvent: editedEvent}));
  };

  const onSubmit: SubmitHandler<TFormValues> = eventData => {
    if (actionType === 'create') {
      handleCreateEvent(eventData);
    } else {
      handleEditEvent(eventData);
    }

    handleModalClose();
  };

  const customEventCalendarOption = useCallback((option: string) => {
    const currentCalendar = defaultCalendars.find(c => c.name === option);

    return (
      <div className="w-full flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{backgroundColor: currentCalendar?.itemColor}} />
        <span>{option}</span>
      </div>
    );
  }, []);

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
            {!date ? (
              <div className="grid grid-cols-2 gap-2 relative self-stretch max-md:grid-cols-1">
                <DropdownControl control={control} options={monthsOptions} name="eventMonth" />
                <DropdownControl control={control} options={yearsOptions} name="eventYear" />
                <DropdownControl control={control} options={daysOptions} name="eventDay" />
                <DropdownControl
                  control={control}
                  options={calendarOptions}
                  name="eventCalendar"
                  customOption={customEventCalendarOption}
                />
              </div>
            ) : (
              <DropdownControl
                control={control}
                options={calendarOptions}
                name="eventCalendar"
                customOption={customEventCalendarOption}
              />
            )}

            <div className="w-full flex flex-col gap-2">
              <InputControl autoFocus control={control} name="eventTitle" placeholder="Enter required name" />
              <TextareaControl control={control} name="eventDescription" placeholder="Enter optional description" />
            </div>

            <Button
              className={classNames(
                {
                  'border-sky-500 text-sky-500': isDirty,
                },
                'text-sm p-2 max-md:w-full',
              )}
              disabled={!isDirty || !!errors.eventTitle}
              text={actionType === FormActionType.edit ? 'Edit' : 'Create'}
              endIcon={actionType === FormActionType.edit ? <EditIcon size="size-4" /> : <PlusIcon size="size-4" />}
              type="submit"
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EventForm;
