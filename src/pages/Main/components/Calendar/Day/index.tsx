import {memo} from 'react';

import DottedEventsList from '@/components/common/DottedEventsList';
import {useEventsList} from '@/hooks/useEventsList';
import {useAgendaPanelActions} from '@/pages/Main/AgendaPanelContext';
import {formatDate, formatEventsCount, getDate} from '@/services/dateUtils';
import {cx} from '@/services/utils';

import DayEventsList from './DayEventsList';
import {TDayProps} from './types';

// Screen size, selection, today and the Visible month come in as plain props from MonthGrid (computed once for the
// grid), so memo holds: selecting a day re-renders only the cells whose state changed, not all 42
const Day = ({date, isTabStop, isSelected, isToday, isOutsideMonth, isMobileScreen, isCompact}: TDayProps) => {
  const {openFor} = useAgendaPanelActions();

  const events = useEventsList(date) || [];
  const hasEvents = events.length > 0;

  // Selects the tapped / clicked day on every screen size (the Agenda panel shows it from md, the Bottom sheet below)
  const handleDayClick = () => openFor(date);

  return (
    // a gridcell of the Month grid; its numeral button is the focusable part. Selection is the gridcell's
    // aria-selected (the ARIA grid pattern), not a pressed state on the button
    <div
      role="gridcell"
      aria-selected={isSelected}
      onClick={handleDayClick}
      className={cx(
        'group @container flex flex-col gap-1 relative min-h-0 min-w-0 border-r border-b border-line p-1.5 transition-colors cursor-default',
        {
          // a neighbouring month's day: a light hairline hatch over the sunken fill (the Calendar mix's 135° hatch for
          // "present, outside the current scope"), so its row never reads as the Visible month without two hatched
          // rows outweighing it; the faint numeral holds 5.0:1 where a stripe crosses a glyph (5.4:1 on the fill)
          'bg-surface-sunken bg-[repeating-linear-gradient(135deg,color-mix(in_srgb,var(--color-line)_45%,transparent)_0_1px,transparent_1px_7px)]':
            isOutsideMonth,
          'md:hover:bg-surface-raised': true,
          // Selection is the cell's green frame alone; today is the numeral's blue fill alone. Each mark has its own
          // element, so a selected today is frame plus fill, never two marks on the numeral (the mini calendar
          // follows the same split)
          'z-10 outline-2 -outline-offset-2 outline-action': isSelected,
          // a narrow desktop cell (tablet, or a small screen with the Agenda panel open): 4px at the sides gives the
          // bars more width
          'md:px-1': isCompact,
        },
        'max-md:border-none max-md:items-center max-md:justify-start max-md:min-h-11 max-md:gap-1.5 max-md:p-0 max-md:pt-1.5',
        // a short phone (the Bottom sheet's peek capped, rows near their 44px minimum): a tighter head, so the dots stay
        // inside the selection outline
        'max-md:[@media(max-height:759px)]:gap-1 max-md:[@media(max-height:759px)]:pt-1',
      )}>
      <div className="flex items-center md:h-7 shrink-0">
        {/* The numeral carries the day's weight: bold full-strength text on a day with events, regular muted text on an
            empty one (so free days recede), faint for a neighbouring month's day. One tab stop for the whole grid on
            every screen size (MonthGrid moves it with the arrows); tabIndex never affects taps. */}
        <button
          type="button"
          data-day={date}
          tabIndex={isTabStop ? 0 : -1}
          aria-current={isToday ? 'date' : undefined}
          aria-label={`${formatDate(getDate(date), 'dddd D MMMM')}, ${formatEventsCount(events.length)}`}
          onClick={e => {
            e.stopPropagation();
            handleDayClick();
          }}
          className={cx(
            'cursor-pointer text-h6 md:text-h4 tabular-nums px-1 min-w-8 h-8 md:min-w-7 md:h-7 max-md:[@media(max-height:759px)]:h-7 flex items-center justify-center transition-colors',
            isOutsideMonth
              ? 'text-text-faint font-normal'
              : hasEvents
                ? 'text-text font-bold'
                : 'text-text-muted font-normal',
            {'bg-info text-info-ink': isToday},
          )}>
          <time dateTime={date}>{formatDate(getDate(date), 'D')}</time>
        </button>
      </div>

      {isMobileScreen ? (
        <DottedEventsList events={events} />
      ) : isCompact ? (
        // a narrow desktop cell (md to about 1100px with the Agenda panel open): one calendar-coloured bar per event
        // instead of chips cut to a few letters, with "+N" in the numeral row as for chips; the Agenda panel lists the
        // selected day's events by name
        <DayEventsList variant="bars" date={date} events={events} className={cx({'opacity-60': isOutsideMonth})} />
      ) : (
        // the chips and "+N more" are the day's load: no separate gauge or wash (the Agenda panel's Calendar mix
        // breaks the selected day down by calendar)
        <DayEventsList date={date} events={events} className={cx({'opacity-60': isOutsideMonth})} />
      )}
    </div>
  );
};

export default memo(Day);
