// PROTOTYPE: desktop variant A = right-hand agenda panel.
import moment from 'moment';
import {motion, useReducedMotion} from 'motion/react';
import {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router';

import {setSelectedDate} from '@/redux/date/dateSlice';
import {selectSelectedDate} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';

import ProtoHeader from './ProtoHeader';
import {ProtoMonthGrid, ProtoWeekdays} from './ProtoMonthGrid';
import {AgendaList, PrimaryButton, pluralEvents, useDayEvents, useEventForm} from './shared';

const AgendaPanel = ({date, onClose}: {date: string; onClose: () => void}) => {
  const events = useDayEvents(date);
  const {create} = useEventForm();
  const reduce = useReducedMotion();
  const day = moment(date);

  return (
    <motion.aside
      aria-label={`Agenda for ${day.format('D MMMM')}`}
      initial={reduce ? false : {opacity: 0, x: 24}}
      animate={{opacity: 1, x: 0}}
      transition={{duration: 0.18, ease: 'easeOut'}}
      className="flex w-85 shrink-0 flex-col border-l border-(--line) bg-(--surface-sunken)">
      <div className="flex items-start gap-3 border-b border-(--line) p-5">
        <div className="min-w-0 flex-1">
          <p className="proto-mono text-[11px] uppercase tracking-widest text-(--text-faint)">{day.format('dddd')}</p>
          <p className="proto-display text-7xl leading-none text-(--text)">{day.format('DD')}</p>
          <p className="proto-mono mt-2 text-xs text-(--text-muted)">
            {day.format('MMMM YYYY')} · {pluralEvents(events.length)}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close agenda"
          onClick={onClose}
          className="proto-mono flex size-8 cursor-pointer items-center justify-center border border-(--line-strong) text-(--text-muted) hover:text-(--text)">
          ×
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <AgendaList date={date} events={events} />
      </div>

      <div className="flex items-center gap-2 border-t border-(--line) p-4">
        <PrimaryButton className="flex-1" onClick={() => create(date)}>
          + Add event
        </PrimaryButton>
        <Link
          to={`/day/${date}`}
          className="proto-mono flex h-9 items-center border border-(--line-strong) px-3 text-xs uppercase tracking-wider text-(--text-muted) hover:text-(--text)">
          Open day ↗
        </Link>
      </div>
    </motion.aside>
  );
};

const DesktopHome = () => {
  const dispatch = useAppDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const [panelOpen, setPanelOpen] = useState(true);

  const handleSelect = useCallback(
    (date: string) => {
      dispatch(setSelectedDate(date));
      setPanelOpen(true);
    },
    [dispatch],
  );

  return (
    <div className="flex h-full flex-col">
      <ProtoHeader />

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <ProtoWeekdays mode="desktop" />
          <ProtoMonthGrid mode="desktop" selectedDate={selectedDate} onSelect={handleSelect} />
        </div>

        {panelOpen && <AgendaPanel date={selectedDate} onClose={() => setPanelOpen(false)} />}
      </div>
    </div>
  );
};

export default DesktopHome;
