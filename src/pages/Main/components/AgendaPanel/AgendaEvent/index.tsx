import {useEffect, useRef} from 'react';

import {useOpenEventForm} from '@/hooks/useOpenEventForm';
import {usePrefersReducedMotion} from '@/hooks/usePrefersReducedMotion';
import {getEventColor} from '@/services/calendars';
import {calendarColorStyle} from '@/services/styles';
import {cx} from '@/services/utils';

import {TAgendaEventProps} from './types';

// One row of the Agenda panel / Bottom sheet; selecting it edits the event (its tooltip says "Edit …"; the row carries
// no trailing Edit control). A Dimmed event stays visible but non-interactive (same rule as the grid). When the event's
// chip in the Month grid was clicked ("Show in agenda") the row is highlighted: scrolled into view and framed in green,
// so the click visibly lands here; it fades back once the highlight clears (cleared at once, and scrolled without
// smoothing, under reduced motion).
const AgendaEvent = ({event, isDisabled, isHighlighted = false}: TAgendaEventProps) => {
  const {openEdit} = useOpenEventForm();
  const reduceMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isHighlighted) return;

    ref.current?.scrollIntoView({block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth'});
  }, [isHighlighted, reduceMotion]);

  return (
    <button
      ref={ref}
      type="button"
      disabled={isDisabled}
      title={isDisabled ? `${event.title} (filtered out)` : `Edit ${event.title}`}
      onClick={() => openEdit(event)}
      style={calendarColorStyle(getEventColor(event))}
      className={cx(
        'group relative flex w-full min-h-11 items-stretch gap-3 border text-left',
        isDisabled
          ? 'cursor-not-allowed border-dashed border-line-strong bg-transparent'
          : 'cursor-pointer border-line bg-surface-raised hover:border-line-strong hover:bg-surface-overlay',
      )}>
      {/* the highlight: a green frame and a faint green wash that light at once and fade out slowly, so the eye finds
          the row after the click; kept off the row's own border so hover stays quick */}
      <span
        aria-hidden
        className={cx(
          'pointer-events-none absolute -inset-px border border-action bg-action/8 transition-opacity ease-out',
          isHighlighted ? 'opacity-100 duration-0' : 'opacity-0 duration-700 motion-reduce:duration-0',
        )}
      />
      <span aria-hidden className={cx('w-1 shrink-0', isDisabled ? 'bg-transparent' : 'bg-(--calendar-color)')} />
      <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-2 pr-4">
        <span className={cx('truncate text-h5', isDisabled ? 'text-text-faint italic' : 'text-text')}>
          {event.title}
        </span>
        <span className="truncate text-caption text-text-faint">
          {/* an event saved before calendars existed has no calendar name */}
          {[event.eventCalendar, event.description].filter(Boolean).join(' · ')}
        </span>
      </span>
    </button>
  );
};

export default AgendaEvent;
