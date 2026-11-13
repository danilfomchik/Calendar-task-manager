import moment from 'moment';
import {useState} from 'react';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import Sheet from '@/components/common/Sheet';
import {useEventsList} from '@/hooks/useEventsList';
import {selectSelectedDate} from '@/redux/date/selectors';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {FormActionType} from '@/types/eventFormTypes';

import AgendaEvent from '../AgendaPanel/AgendaEvent';
import {SHEET_PEEK} from './constants';

const BottomSheet = () => {
  const dispatch = useAppDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const activeCalendars = useSelector(selectActiveCalendars);
  const events = useEventsList(selectedDate);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddEvent = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.create, date: selectedDate}));
  };

  const day = moment(selectedDate);
  const eventsCount = events?.length ?? 0;

  return (
    <Sheet
      label={`Events for ${day.format('D MMMM')}`}
      isOpen={isExpanded}
      onOpenChange={setIsExpanded}
      peek={SHEET_PEEK}
      layerClassName="z-20 md:hidden"
      className="bg-surface-raised shadow-[0_-12px_32px_rgba(0,0,0,0.55)]">
      {({isOpen, toggle, startDrag, guardClick}) => (
        <>
          <button
            type="button"
            aria-label="Add event"
            onClick={handleAddEvent}
            className="absolute -top-7 right-4 flex size-14 cursor-pointer items-center justify-center bg-action font-mono text-3xl font-medium text-action-ink shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
            +
          </button>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse events' : 'Expand events'}
            onPointerDown={startDrag}
            onClick={guardClick(toggle)}
            className="flex h-11 w-full shrink-0 cursor-grab touch-none items-center justify-center">
            <span aria-hidden className="h-1 w-10 bg-line-strong" />
          </button>

          <div onPointerDown={startDrag} className="flex shrink-0 touch-none items-end gap-3 px-4 pb-3">
            <span className="font-display text-6xl font-extrabold leading-[0.85] text-text">{day.format('DD')}</span>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pb-0.5">
              <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                {day.format('dddd')}
              </span>
              <span className="font-mono text-xs text-text-faint">
                {day.format('MMM YYYY')} · {eventsCount} {eventsCount === 1 ? 'event' : 'events'}
              </span>
            </div>

            <Button
              kind="link"
              to={`/day/${selectedDate}`}
              text="Open day ↗"
              className="h-8 shrink-0 rounded-none border-line-strong bg-transparent p-0 px-2.5 font-mono text-xs uppercase tracking-wider text-text-muted hover:text-text"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
            {eventsCount === 0 ? (
              <p className="font-mono text-xs text-text-faint">
                No events{' '}
                <button
                  type="button"
                  onClick={handleAddEvent}
                  className="-my-3 cursor-pointer px-1 py-3 text-action underline underline-offset-2">
                  Add event
                </button>
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {events?.map(event => (
                  <li key={event.id}>
                    <AgendaEvent event={event} isDisabled={isEventDimmed(activeCalendars, event.eventCalendar)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </Sheet>
  );
};

export default BottomSheet;
