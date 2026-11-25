import moment from 'moment';
import {useSelector} from 'react-redux';
import {Link} from 'react-router';

import DayNote from '@/components/common/DayNote';
import ArrowRight from '@/components/ui/icons/ArrowRight';
import {useEventsList} from '@/hooks/useEventsList';
import AgendaEmpty from '@/pages/Main/components/AgendaEmpty';
import {AGENDA_PANEL_ID} from '@/pages/Main/constants';
import {selectSelectedDate} from '@/redux/date/selectors';
import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';
import {getDayPath} from '@/services/dateUtils';
import {HAIRLINE_CONTROL_CLASS} from '@/services/styles';
import {cx} from '@/services/utils';

import {useAgendaPanel} from '../../AgendaPanelContext';
import AgendaEvent from './AgendaEvent';
import AgendaHeader from './AgendaHeader';

const AgendaPanel = () => {
  const {isOpen, highlightedEventId} = useAgendaPanel();

  const selectedDate = useSelector(selectSelectedDate);
  const activeCalendars = useSelector(selectActiveCalendars);
  const events = useEventsList(selectedDate) || [];

  if (!isOpen) return null;

  const day = moment(selectedDate);

  return (
    // the entrance (a short fade and slide in from the right) is a CSS animation, so Home's first paint does not wait
    // for the `motion` library; under reduced motion index.css makes it instant
    <aside
      id={AGENDA_PANEL_ID}
      tabIndex={-1}
      aria-label={`Agenda for ${day.format('D MMMM')}`}
      className="animate-panel-in max-md:hidden flex focus-visible:-outline-offset-2 w-85 shrink-0 flex-col border-l border-line bg-surface-sunken h-[calc(100svh-var(--height-home-header))]">
      <AgendaHeader date={selectedDate} eventsCount={events.length} />

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {events.length === 0 ? (
          <AgendaEmpty date={selectedDate} placement="panel" />
        ) : (
          <ul className="flex flex-col gap-1.5">
            {events.map(event => (
              <li key={event.id}>
                <AgendaEvent
                  event={event}
                  isDisabled={isEventDimmed(activeCalendars, event.eventCalendar)}
                  isHighlighted={event.id === highlightedEventId}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* The Day note is keyed by date, so a pending draft is saved to its own day before the selected date changes
          (and when the panel closes) */}
      <div className="flex flex-col gap-3 border-t border-line p-4">
        <DayNote date={selectedDate} />

        {/* Adding lives in the header (its green Add event adds to this day), so the panel's foot only leads on */}
        <Link to={getDayPath(selectedDate)} className={cx(HAIRLINE_CONTROL_CLASS, 'justify-between')}>
          Open {day.format('D MMMM')}
          <ArrowRight size="size-4" aria-hidden />
        </Link>
      </div>
    </aside>
  );
};

export default AgendaPanel;
