import moment from 'moment';
import {useState} from 'react';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import DayNote from '@/components/common/DayNote';
import Sheet from '@/components/common/Sheet';
import {useEventsList} from '@/hooks/useEventsList';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {selectSelectedDate} from '@/redux/date/selectors';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {formatEventsCount} from '@/services/dateUtils';
import {FormActionType} from '@/types/eventFormTypes';

import AgendaEvent from '../AgendaPanel/AgendaEvent';
import HolidayLine from '../HolidayLine';
import {SHEET_PEEK} from './constants';

const BottomSheet = () => {
  const dispatch = useAppDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const activeCalendars = useSelector(selectActiveCalendars);
  const events = useEventsList(selectedDate);
  const [isExpanded, setIsExpanded] = useState(false);
  // the sheet stays mounted but hidden from md up; only ask for the holiday where the sheet is actually shown
  const isSheetShown = useMediaQuery({size: 'sm', direction: 'to'});

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

          {/* 24px visually, but a 44px tall hit area: the pseudo-element hangs 20px down over the date row (itself a
              drag area) without adding height to the peek */}
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse events' : 'Expand events'}
            onPointerDown={startDrag}
            onClick={guardClick(toggle)}
            className="relative z-10 flex h-6 w-full shrink-0 cursor-grab touch-none items-center justify-center before:absolute before:inset-x-0 before:top-0 before:h-11 before:content-['']">
            <span aria-hidden className="h-1 w-10 bg-line-strong" />
          </button>

          <div onPointerDown={startDrag} className="flex shrink-0 touch-none items-end gap-3 px-4 pb-2">
            <span className="font-display text-6xl font-extrabold leading-[0.85] text-text">{day.format('DD')}</span>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pb-0.5">
              <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                {day.format('dddd')}
              </span>
              <span className="font-mono text-xs text-text-faint">
                {day.format('MMM YYYY')} · {formatEventsCount(eventsCount)}
              </span>
            </div>

            <Button
              kind="link"
              to={`/day/${selectedDate}`}
              text="Open day ↗"
              // above the handle's enlarged hit area, which reaches the top pixel of this link
              className="relative z-20 h-8 shrink-0 rounded-none border-line-strong bg-transparent p-0 px-2.5 font-mono text-xs uppercase tracking-wider text-text-muted hover:text-text"
            />
          </div>

          {/* Not a drag area: taps, typing and scrolling the note must never move the sheet, so this block has no
              touch-none and stops pointerdown (the Popover listens in the capture phase, so it still closes). */}
          <div onPointerDown={e => e.stopPropagation()} className="flex shrink-0 flex-col gap-1.5 px-4 pb-2">
            {isSheetShown && <HolidayLine date={selectedDate} />}
            {/* one line while the sheet is peeking, so the first event stays in view; full row once expanded */}
            <DayNote date={selectedDate} variant={isOpen ? 'row' : 'compact'} />
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
