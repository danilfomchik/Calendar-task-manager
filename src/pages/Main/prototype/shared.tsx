/* eslint-disable react-refresh/only-export-components */
// PROTOTYPE: shared bits for the home redesign variants.
import moment from 'moment';
import {CSSProperties, useMemo} from 'react';
import {useSelector} from 'react-redux';

import {useEventsList} from '@/hooks/useEventsList';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {TEvent} from '@/redux/events/types';
import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {getCalendarColor} from '@/services/calendars';
import {EVENT_FORM_ID} from '@/services/constants';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';
import {CalendarsNames} from '@/types/types';

const EMPTY: TEvent[] = [];

export const todayStr = () => moment().format('YYYY-MM-DD');

export const useDayEvents = (date: string) => useEventsList(date) ?? EMPTY;

export const useIsDimmed = () => {
  const active = useSelector(selectActiveCalendars);
  return (calendar: CalendarsNames) => isEventDimmed(active, calendar);
};

export const useEventForm = () => {
  const dispatch = useAppDispatch();

  return useMemo(
    () => ({
      create: (date: string) => {
        dispatch(onOpenItem(EVENT_FORM_ID));
        dispatch(setEventFormData({actionType: FormActionType.create, date}));
      },
      edit: (event: TEvent) => {
        dispatch(onOpenItem(EVENT_FORM_ID));
        dispatch(setEventFormData({actionType: FormActionType.edit, event}));
      },
    }),
    [dispatch],
  );
};

export const calendarVars = (calendar: CalendarsNames) =>
  ({'--calendar-color': getCalendarColor(calendar)}) as CSSProperties;

export const pluralEvents = (count: number) => `${count} ${count === 1 ? 'event' : 'events'}`;

// one row of an event list: calendar-colour bar + title + mono calendar name (so colour is never the only signal)
export const AgendaItem = ({event, className}: {event: TEvent; className?: string}) => {
  const {edit} = useEventForm();
  const isDimmed = useIsDimmed()(event.eventCalendar);

  return (
    <button
      type="button"
      disabled={isDimmed}
      onClick={() => edit(event)}
      style={calendarVars(event.eventCalendar)}
      className={cx(
        'flex w-full min-h-11 cursor-pointer items-stretch gap-3 border border-(--line) bg-(--surface-raised) text-left transition-colors hover:border-(--line-strong) hover:bg-(--surface-overlay) disabled:cursor-not-allowed disabled:hover:border-(--line) disabled:hover:bg-(--surface-raised)',
        className,
      )}>
      <span aria-hidden className="w-1 shrink-0 bg-(--calendar-color)" />
      <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-2 pr-3">
        <span
          className={cx('truncate text-[15px] font-semibold leading-tight', {
            'text-(--text)': !isDimmed,
            'text-(--text-faint)': isDimmed,
          })}>
          {event.title}
        </span>
        <span className="proto-mono truncate text-[11px] uppercase tracking-wider text-(--text-faint)">
          {event.eventCalendar}
          {event.description ? ` · ${event.description}` : ''}
        </span>
      </span>
    </button>
  );
};

export const EmptyDay = ({date}: {date: string}) => {
  const {create} = useEventForm();

  return (
    <p className="proto-mono text-xs text-(--text-faint)">
      No events{' '}
      <button
        type="button"
        onClick={() => create(date)}
        className="cursor-pointer text-(--action) underline underline-offset-2">
        Add event
      </button>
    </p>
  );
};

export const AgendaList = ({date, events}: {date: string; events: TEvent[]}) => {
  if (!events.length) return <EmptyDay date={date} />;

  return (
    <ul className="flex flex-col gap-1.5">
      {events.map(event => (
        <li key={event.id}>
          <AgendaItem event={event} />
        </li>
      ))}
    </ul>
  );
};

export const PrimaryButton = ({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {className?: string}) => (
  <button
    type="button"
    className={cx(
      'proto-mono inline-flex h-9 cursor-pointer items-center justify-center gap-2 bg-(--action) px-3 text-xs font-medium uppercase tracking-wider text-(--action-ink) hover:brightness-110',
      className,
    )}
    {...rest}>
    {children}
  </button>
);
