import {yupResolver} from '@hookform/resolvers/yup';
import moment from 'moment';
import {useCallback, useId, useMemo, useState} from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {useSelector} from 'react-redux';

import DropdownControl from '@/components/common/formInputs/DropdownControl';
import InputControl from '@/components/common/formInputs/InputControl';
import TextareaControl from '@/components/common/formInputs/TextareaControl';
import CloseIcon from '@/components/ui/icons/CloseIcon';
import {selectDay, selectMonth, selectYear} from '@/redux/date/selectors';
import {addEvent, editEvent} from '@/redux/events/eventsSlice';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_TITLE_ID, defaultCalendars} from '@/services/constants';
import {createDate, formatDate, getDays, getMonthsOptions, getYearsOptions} from '@/services/dateUtils';
import {createEventObj, editEventObj} from '@/services/eventUtils';
import {HAIRLINE_CONTROL_BASE_CLASS, HAIRLINE_CONTROL_CLASS, PRIMARY_ACTION_CLASS} from '@/services/styles';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';
import {CalendarsNames} from '@/types/types';

import {FIELD_TRIGGER_CLASS} from './constants';
import {validation} from './form';
import {TEventFormProps, TFormValues} from './types';

const EventForm = ({actionType = FormActionType.create, event, date, handleModalClose}: TEventFormProps) => {
  const dispatch = useAppDispatch();
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);
  const day = useSelector(selectDay);

  const defaultValues = {
    eventTitle: event?.title ?? '',
    eventDescription: event?.description ?? '',
    eventYear: formatDate(moment(event?.date || date), 'YYYY') || year || '',
    eventMonth: formatDate(moment(event?.date || date), 'MMMM') || month || '',
    eventDay: formatDate(moment(event?.date || date), 'D') || (day ? String(Number(day)) : ''),
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
    formState: {isDirty},
  } = methods;

  const titleId = useId();
  const descriptionId = useId();
  // with no day chosen (and no event to take one from) the date pickers start open
  const [isPickingDate, setIsPickingDate] = useState(!date && !event);

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
      <span className="flex w-full items-center gap-2">
        <span className="size-2 shrink-0 rounded-full" style={{backgroundColor: currentCalendar?.itemColor}} />
        <span>{option}</span>
      </span>
    );
  }, []);

  const isEdit = actionType === FormActionType.edit;
  const formDay = watch('eventDay');
  const pickedDate = moment(`${formYearValue}-${formMonthValue}-${formDay}`, 'YYYY-MMMM-D');

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-line py-3 pr-3 pl-5">
        <h2 id={EVENT_FORM_TITLE_ID} className="text-h5">
          {isEdit ? 'Edit event' : 'New event'}
        </h2>
        <button
          type="button"
          aria-label="Close"
          title="Close"
          onClick={handleModalClose}
          className={cx(HAIRLINE_CONTROL_BASE_CLASS, 'flex size-11 md:size-9')}>
          <CloseIcon size="size-4" />
        </button>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-5">
          {/* The date is always on show, so an event never lands on a day the user didn't check; the pickers open on
              Change, or straight away when nothing chose the day */}
          {isPickingDate ? (
            <fieldset className="flex flex-col gap-1.5">
              <legend className="mb-1.5 text-caption text-text-muted">Date</legend>
              <div className="grid grid-cols-3 gap-2">
                <DropdownControl
                  control={control}
                  options={daysOptions}
                  name="eventDay"
                  triggerClassName={FIELD_TRIGGER_CLASS}
                />
                <DropdownControl
                  control={control}
                  options={monthsOptions}
                  name="eventMonth"
                  triggerClassName={FIELD_TRIGGER_CLASS}
                />
                <DropdownControl
                  control={control}
                  options={yearsOptions}
                  name="eventYear"
                  triggerClassName={FIELD_TRIGGER_CLASS}
                />
              </div>
            </fieldset>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-col">
                <span className="text-caption text-text-muted">Date</span>
                <span className="truncate text-h6">{pickedDate.format('dddd D MMMM YYYY')}</span>
              </div>
              <button type="button" onClick={() => setIsPickingDate(true)} className={HAIRLINE_CONTROL_CLASS}>
                Change
              </button>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor={titleId} className="text-caption text-text-muted">
              Title
            </label>
            <InputControl id={titleId} autoFocus control={control} name="eventTitle" placeholder="What's happening?" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={descriptionId} className="text-caption text-text-muted">
              Description <span className="text-text-faint">(optional)</span>
            </label>
            <TextareaControl
              id={descriptionId}
              control={control}
              name="eventDescription"
              placeholder="Where, who, anything to remember"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-caption text-text-muted">Calendar</span>
            <DropdownControl
              control={control}
              options={calendarOptions}
              name="eventCalendar"
              customOption={customEventCalendarOption}
              triggerClassName={FIELD_TRIGGER_CLASS}
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-line pt-4 max-sm:flex-col-reverse max-sm:items-stretch">
            <button type="button" onClick={handleModalClose} className={HAIRLINE_CONTROL_CLASS + ' justify-center'}>
              Cancel
            </button>
            {/* An edit without changes has nothing to save; a new event can always be submitted, and validation names
                what is missing */}
            <button type="submit" disabled={isEdit && !isDirty} className={PRIMARY_ACTION_CLASS}>
              {isEdit ? 'Save changes' : 'Create event'}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EventForm;
