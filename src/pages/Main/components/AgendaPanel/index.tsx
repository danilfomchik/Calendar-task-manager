import moment from 'moment';
import {motion, useReducedMotion} from 'motion/react';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import {useEventsList} from '@/hooks/useEventsList';
import {selectSelectedDate} from '@/redux/date/selectors';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {isEventDimmed} from '@/redux/myCalendars/helpers';
import {selectActiveCalendars} from '@/redux/myCalendars/selectors';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {FormActionType} from '@/types/eventFormTypes';

import {useAgendaPanel} from '../../AgendaPanelContext';
import AgendaEvent from './AgendaEvent';

const AgendaPanel = () => {
  const dispatch = useAppDispatch();
  const reduceMotion = useReducedMotion();
  const {isOpen, close} = useAgendaPanel();

  const selectedDate = useSelector(selectSelectedDate);
  const activeCalendars = useSelector(selectActiveCalendars);
  const events = useEventsList(selectedDate) || [];

  if (!isOpen) return null;

  const day = moment(selectedDate);

  const handleAdd = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.create, date: selectedDate}));
  };

  return (
    <motion.aside
      aria-label={`Agenda for ${day.format('D MMMM')}`}
      initial={reduceMotion ? false : {opacity: 0, x: 24}}
      animate={{opacity: 1, x: 0}}
      transition={{duration: 0.18, ease: 'easeOut'}}
      onKeyDown={e => e.key === 'Escape' && close()}
      className="max-md:hidden flex w-85 shrink-0 flex-col border-l border-line bg-surface-sunken h-[calc(100vh-var(--height-home-header))]">
      <div className="flex items-start gap-3 border-b border-line p-5">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-widest text-text-faint">{day.format('dddd')}</p>
          <p className="font-display font-extrabold tracking-tight text-7xl leading-none text-text">
            {day.format('DD')}
          </p>
          <p className="font-mono mt-2 text-xs text-text-muted">
            {day.format('MMMM YYYY')} · {events.length} {events.length === 1 ? 'event' : 'events'}
          </p>
        </div>

        <button
          type="button"
          aria-label="Close agenda"
          title="Close agenda"
          onClick={close}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center border border-line-strong font-mono text-text-muted transition-colors hover:text-text">
          ×
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {events.length === 0 ? (
          <p className="font-mono text-xs text-text-faint">
            No events{' '}
            <button
              type="button"
              onClick={handleAdd}
              className="cursor-pointer text-action underline underline-offset-2">
              Add event
            </button>
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {events.map(event => (
              <li key={event.id}>
                <AgendaEvent event={event} isDisabled={isEventDimmed(activeCalendars, event.eventCalendar)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-line p-4">
        <Button
          text="+ Add event"
          onClick={handleAdd}
          className="h-9 flex-1 rounded-none border-action bg-action p-0 px-3 font-mono text-xs font-medium uppercase tracking-wider text-action-ink hover:brightness-110"
        />
        <Button
          kind="link"
          to={`/day/${selectedDate}`}
          text="Open day ↗"
          className="h-9 rounded-none border-line-strong bg-transparent p-0 px-3 font-mono text-xs uppercase tracking-wider text-text-muted hover:text-text"
        />
      </div>
    </motion.aside>
  );
};

export default AgendaPanel;
