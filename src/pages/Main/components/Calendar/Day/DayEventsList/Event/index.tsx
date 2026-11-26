import {memo} from 'react';

import {useAgendaPanelActions} from '@/pages/Main/AgendaPanelContext';
import {getEventColor} from '@/services/calendars';
import {calendarColorStyle} from '@/services/styles';
import {cx} from '@/services/utils';

import {TEventProps} from './types';

const Event = ({event, date, isDisabled}: TEventProps) => {
  const {showEvent} = useAgendaPanelActions();

  const name = [event.title, event.eventCalendar].filter(Boolean).join(' · ');

  return (
    // Selects the day (as a click elsewhere in the cell does) and highlights this event's row in the Agenda panel;
    // editing starts from that row, so aiming at a busy day never opens an edit by accident. Its name and tooltip say
    // "Show in agenda" rather than leaving the title alone, so a first click that does not open the event is expected,
    // and selecting the highlighted row (AgendaEvent) then edits it. Out of the tab order: the
    // grid is one tab stop and the panel lists the selected day's events as buttons. A Dimmed event keeps its dimmed look
    // and is marked aria-disabled rather than disabled, so its click still selects the day. The fill is translucent (about
    // surface-overlay on the base surface) so a chip stays a step lighter than its cell.
    <button
      type="button"
      tabIndex={-1}
      aria-disabled={isDisabled || undefined}
      aria-label={`Show ${event.title} in agenda`}
      title={`${name}${isDisabled ? ' (filtered out)' : ''}\nShow in agenda`}
      className={cx(
        'h-(--event-height) w-full shrink-0 flex items-center gap-1.5 overflow-hidden text-left text-caption leading-none cursor-pointer',
        isDisabled ? 'border border-dashed border-line-strong bg-transparent' : 'bg-chip hover:bg-line',
      )}
      style={calendarColorStyle(getEventColor(event))}
      onClick={e => {
        e.stopPropagation();
        showEvent(date, event.id);
      }}>
      <span
        aria-hidden
        className={cx('h-full w-0.75 shrink-0', isDisabled ? 'bg-transparent' : 'bg-(--calendar-color)')}
      />
      <span className={cx('truncate', isDisabled ? 'text-text-muted italic' : 'text-text')}>{event.title}</span>
    </button>
  );
};

export default memo(Event);
