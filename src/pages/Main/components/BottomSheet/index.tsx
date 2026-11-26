import moment from 'moment';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router';

import CalendarMix from '@/components/common/CalendarMix';
import DayNote from '@/components/common/DayNote';
import EventsTotal from '@/components/common/EventsTotal';
import Sheet from '@/components/common/Sheet';
import ArrowRight from '@/components/ui/icons/ArrowRight';
import {useEventsList} from '@/hooks/useEventsList';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import AgendaEmpty from '@/pages/Main/components/AgendaEmpty';
import AgendaEvent from '@/pages/Main/components/AgendaPanel/AgendaEvent';
import DayHeading from '@/pages/Main/components/DayHeading';
import HolidayLine from '@/pages/Main/components/HolidayLine';
import {selectSelectedDate} from '@/redux/date/selectors';
import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';
import {selectOpenedItems} from '@/redux/overflow/selectors';
import {getDayPath} from '@/services/dateUtils';
import {inertProps, stopPropagation} from '@/services/dom';

import SheetAddButton from './SheetAddButton';
import {SHEET_TOP_GAP} from './constants';
import {TBottomSheetProps} from './types';

const BottomSheet = ({peek}: TBottomSheetProps) => {
  const selectedDate = useSelector(selectSelectedDate);
  const activeCalendars = useSelector(selectActiveCalendars);
  const events = useEventsList(selectedDate);
  // modals and menus opened over the sheet (e.g. add event) handle their own Esc
  const openedItems = useSelector(selectOpenedItems);
  const [isExpanded, setIsExpanded] = useState(false);
  // the sheet stays mounted but hidden from md up; only ask for the holiday where the sheet is actually shown
  const isSheetShown = useMediaQuery({size: 'sm', direction: 'to'});

  const day = moment(selectedDate);
  const eventsCount = events?.length ?? 0;

  return (
    <Sheet
      label={`Events for ${day.format('D MMMM')}`}
      isOpen={isExpanded}
      onOpenChange={setIsExpanded}
      peek={peek}
      modal
      topGap={SHEET_TOP_GAP}
      isEscapeDisabled={openedItems > 0}
      layerClassName="fixed z-40 md:hidden"
      className="bg-surface-raised shadow-sheet">
      {({isOpen, toggle, startDrag, guardClick}) => (
        <>
          {/* 24px visually, but a 44px tall hit area: the pseudo-element hangs 20px down over the date row (itself a
              drag area) without adding height to the peek */}
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse events' : 'Expand events'}
            onPointerDown={startDrag}
            onClick={guardClick(toggle)}
            className="group/handle relative z-10 flex h-6 w-full shrink-0 cursor-grab touch-none items-center justify-center bg-surface-overlay before:absolute before:inset-x-0 before:top-0 before:h-11 before:content-['']">
            <span
              aria-hidden
              className="h-1 w-10 bg-line-strong transition-colors group-hover/handle:bg-text-faint group-focus-visible/handle:bg-text-muted"
            />
          </button>

          {/* The sheet header, everything above the events list, on its own band: the overlay surface (which the handle
              above shares, so the band starts at the sheet's top edge) with a hairline under it, lifted over the list
              by a short shadow, so the list reads as scrolling under it */}
          <div className="relative z-1 flex shrink-0 flex-col border-b border-line bg-surface-overlay pt-1 pb-2 shadow-band">
            {/* The date with Open day (bottom-aligned with the month line) and the green add at its right, then the
                events total over the Calendar mix, as in the Agenda panel header. One drag area; the links and the add
                button in it stop the drag. */}
            <div onPointerDown={startDrag} className="flex shrink-0 touch-none flex-col px-4">
              <div className="@container pb-3">
                <DayHeading date={selectedDate} size="sheet">
                  <Link
                    to={getDayPath(selectedDate)}
                    onPointerDown={stopPropagation}
                    aria-label="Open day"
                    // a 20px line with a 44px tall hit area; in the narrowest row (a 320px phone) only the arrow shows,
                    // so the weekday reads in full, and the hit area widens to 44px
                    className="relative mb-0.5 inline-flex shrink-0 items-center gap-1 text-para-s text-text-muted transition-colors before:absolute before:-inset-x-2 before:-inset-y-3 before:content-[''] @max-xs:before:-inset-x-3.5 hover:text-text focus-visible:text-text">
                    <span className="@max-xs:hidden">Open day</span>
                    <ArrowRight size="size-4" aria-hidden />
                  </Link>
                  <SheetAddButton date={selectedDate} />
                </DayHeading>
              </div>

              <div className="flex flex-col gap-2">
                <EventsTotal count={eventsCount} emptyLabel="Free day" />
                {/* a free day has no mix: an empty 3px spacer keeps the list in place, as in the Agenda header */}
                {eventsCount === 0 ? <div aria-hidden className="h-0.75" /> : <CalendarMix date={selectedDate} />}
              </div>
            </div>

            {/* What kind of day it is, under the mix as in the Agenda panel header, on busy and free days alike. Not a
                drag area, so tapping the chip or Retry never moves the sheet; the Popover is portalled out of the sheet.
                Its spacing rides on the line itself, so with AI insights off it leaves no gap. */}
            {isSheetShown && <HolidayLine date={selectedDate} className="mx-4 mt-2 shrink-0" />}
          </div>

          {/* Where scrollbars take layout space (a fine pointer), the gutter is always reserved and comes out of the right
              padding, so rows keep the header's width whether the list scrolls or not. Exact in Chromium (a 4px
              scrollbar, index.css); Firefox's thin scrollbar is a little wider, so there rows sit a few px narrower.
              Its top padding, equal to the bottom, is budgeted in SHEET_PEEK (constants.ts). */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 pointer-fine:pr-3 pointer-fine:scrollbar-gutter-stable">
            {eventsCount === 0 ? (
              <AgendaEmpty date={selectedDate} placement="sheet" />
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
            onPointerDown={stopPropagation}
            className="shrink-0 border-t border-line bg-surface-raised p-4">
            <DayNote date={selectedDate} />
          </div>
        </>
      )}
    </Sheet>
  );
};

export default BottomSheet;
