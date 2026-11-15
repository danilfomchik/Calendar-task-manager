import moment from 'moment';
import {useState} from 'react';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import DayNote from '@/components/common/DayNote';
import EventsTotal from '@/components/common/EventsTotal';
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
import {getTodayKey} from '@/services/dateUtils';
import {cx, inertProps} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';

import AgendaEvent from '../AgendaPanel/AgendaEvent';
import CalendarMix from '../CalendarMix';
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
  const isToday = selectedDate === getTodayKey();

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

          <div onPointerDown={startDrag} className="shrink-0 touch-none px-4 pb-2">
            <div className="flex items-end gap-3">
              <span
                className={cx(
                  'font-display text-6xl leading-[0.8] font-extrabold tracking-[-0.04em] tabular-nums',
                  isToday ? 'text-info' : 'text-text',
                )}>
                {day.format('DD')}
              </span>

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-baseline gap-1.5">
                  <span className="truncate text-[15px] leading-tight font-semibold">{day.format('dddd')}</span>
                  {isToday && (
                    <span className="font-mono text-[10px] font-medium tracking-wider text-info uppercase">Today</span>
                  )}
                </span>
                <span className="truncate text-[13px] text-text-muted">{day.format('MMMM YYYY')}</span>
              </div>

              <Button
                kind="link"
                to={`/day/${selectedDate}`}
                text="Open day ↗"
                // above the handle's enlarged hit area, which reaches the top pixel of this row
                className="relative z-20 h-8 shrink-0 rounded-none border-line-strong bg-transparent p-0 px-2.5 font-mono text-xs uppercase tracking-wider text-text-muted hover:text-text"
              />
            </div>
          </div>

          {/* Not a drag area: tapping the Holiday line never moves the sheet (the Popover listens
              in the capture phase, so it still closes) */}
          <div onPointerDown={e => e.stopPropagation()} className="flex shrink-0 flex-col gap-2.5 px-4 pb-2">
            {/* the events total sits over the mix, not in the date row, where the + button overlaps the right edge */}
            <div className="flex flex-col gap-2">
              <EventsTotal count={eventsCount} className="shrink-0" />
              <CalendarMix date={selectedDate} />
            </div>
            {isSheetShown && <HolidayLine date={selectedDate} />}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto border-t border-line px-4 pt-2 pb-6">
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

          {/* Pinned under the list: the sheet keeps its full height and slides down when collapsed, so the note only
              shows once it is expanded (and is inert until then) and the peek keeps the first event in view; typing never
              moves the sheet */}
          <div
            {...inertProps(!isExpanded)}
            onPointerDown={e => e.stopPropagation()}
            className="shrink-0 border-t border-line bg-surface-raised p-4">
            <DayNote date={selectedDate} appearance="margin" />
          </div>
        </>
      )}
    </Sheet>
  );
};

export default BottomSheet;
