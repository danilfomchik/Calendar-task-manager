// PROTOTYPE: desktop. A = right-hand agenda panel, B = anchored popover for "+N more".
import moment from 'moment';
import {motion, useReducedMotion} from 'motion/react';
import {useCallback, useEffect, useRef, useState} from 'react';
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

type TPopover = {date: string; rect: DOMRect};

const POPOVER_W = 288;

const MorePopover = ({date, rect, onClose}: TPopover & {onClose: () => void}) => {
  const events = useDayEvents(date);
  const {create} = useEventForm();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const day = moment(date);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    ref.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onClose);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onClose);
      opener?.focus?.();
    };
  }, [onClose]);

  const left = Math.min(Math.max(rect.left + rect.width / 2 - POPOVER_W / 2, 8), window.innerWidth - POPOVER_W - 8);
  const maxH = Math.min(380, window.innerHeight - 16);
  const top = Math.min(Math.max(rect.top - 8, 8), window.innerHeight - maxH - 8);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-label={`Events on ${day.format('D MMMM')}`}
        tabIndex={-1}
        initial={reduce ? false : {opacity: 0, y: 6}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.15, ease: 'easeOut'}}
        style={{left, top, width: POPOVER_W, maxHeight: maxH}}
        className="fixed z-50 flex flex-col border border-(--line-strong) bg-(--surface-overlay) shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
        <div className="flex items-baseline gap-2 border-b border-(--line) px-3 py-2">
          <span className="proto-display text-3xl leading-none">{day.format('DD')}</span>
          <span className="proto-mono text-[11px] uppercase tracking-widest text-(--text-muted)">
            {day.format('ddd MMM')} · {pluralEvents(events.length)}
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <AgendaList date={date} events={events} />
        </div>

        <div className="flex items-center justify-between border-t border-(--line) px-3 py-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              create(date);
            }}
            className="proto-mono cursor-pointer text-xs uppercase tracking-wider text-(--action)">
            + Add event
          </button>
          <Link
            to={`/day/${date}`}
            className="proto-mono text-xs uppercase tracking-wider text-(--text-muted) hover:text-(--text)">
            Open day ↗
          </Link>
        </div>
      </motion.div>
    </>
  );
};

const DesktopHome = ({variant}: {variant: 'A' | 'B'}) => {
  const dispatch = useAppDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const [panelOpen, setPanelOpen] = useState(true);
  const [popover, setPopover] = useState<TPopover | null>(null);

  const isPanel = variant === 'A';

  const handleSelect = useCallback(
    (date: string) => {
      dispatch(setSelectedDate(date));
      if (isPanel) setPanelOpen(true);
    },
    [dispatch, isPanel],
  );

  const handleMore = useCallback(
    (date: string, anchor: HTMLElement) => {
      if (isPanel) return;
      setPopover({
        date,
        rect: anchor.closest('[class*="group"]')?.getBoundingClientRect() ?? anchor.getBoundingClientRect(),
      });
    },
    [isPanel],
  );

  const closePopover = useCallback(() => setPopover(null), []);

  return (
    <div className="flex h-full flex-col">
      <ProtoHeader />

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <ProtoWeekdays mode="desktop" />
          <ProtoMonthGrid
            mode="desktop"
            selectedDate={selectedDate}
            onSelect={handleSelect}
            onMore={handleMore}
            showOpenDay={!isPanel}
          />
        </div>

        {isPanel && panelOpen && <AgendaPanel date={selectedDate} onClose={() => setPanelOpen(false)} />}
      </div>

      {!isPanel && popover && <MorePopover {...popover} onClose={closePopover} />}
    </div>
  );
};

export default DesktopHome;
