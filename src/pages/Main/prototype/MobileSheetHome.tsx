// PROTOTYPE: mobile A. Month grid always visible; events live in a draggable bottom sheet over it.
import moment from 'moment';
import {animate, motion, useDragControls, useMotionValue, useReducedMotion} from 'motion/react';
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router';

import {setSelectedDate} from '@/redux/date/dateSlice';
import {selectSelectedDate} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';

import ProtoHeader from './ProtoHeader';
import {ProtoMonthGrid, ProtoWeekdays} from './ProtoMonthGrid';
import {AgendaList, pluralEvents, useDayEvents, useEventForm} from './shared';

const PEEK = 232;
const TOP_GAP = 72;

const MobileSheetHome = () => {
  const dispatch = useAppDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const events = useDayEvents(selectedDate);
  const {create} = useEventForm();
  const reduce = useReducedMotion();
  const controls = useDragControls();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerH, setContainerH] = useState(0);
  const [open, setOpen] = useState(false);
  const y = useMotionValue(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => setContainerH(el.clientHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sheetH = Math.max(containerH - TOP_GAP, PEEK + 40);
  const peekY = sheetH - PEEK;

  // place without animating on first measure / resize
  useEffect(() => {
    y.set(open ? 0 : peekY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peekY]);

  const settle = useCallback(
    (next: boolean) => {
      setOpen(next);
      animate(y, next ? 0 : peekY, {duration: reduce ? 0 : 0.18, ease: 'easeOut'});
    },
    [peekY, reduce, y],
  );

  const day = moment(selectedDate);

  return (
    <div ref={containerRef} className="relative flex h-full flex-col overflow-hidden pb-0">
      <ProtoHeader compact />

      <div className="flex min-h-0 flex-1 flex-col" style={{paddingBottom: PEEK}}>
        <ProtoWeekdays mode="mobile" />
        <ProtoMonthGrid
          mode="mobile"
          selectedDate={selectedDate}
          onSelect={date => dispatch(setSelectedDate(date))}
          className="min-h-0 flex-1"
        />
      </div>

      {containerH > 0 && (
        <motion.section
          aria-label={`Agenda for ${day.format('D MMMM')}`}
          drag="y"
          dragControls={controls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0.05}
          dragConstraints={{top: 0, bottom: peekY}}
          onDragEnd={(_, info) => {
            if (info.velocity.y < -250) settle(true);
            else if (info.velocity.y > 250) settle(false);
            else settle(y.get() < peekY / 2);
          }}
          style={{y, height: sheetH}}
          className="absolute inset-x-0 bottom-0 z-20 flex flex-col border-t border-(--line-strong) bg-(--surface-raised) shadow-[0_-12px_32px_rgba(0,0,0,0.55)]">
          <button
            type="button"
            aria-label="Add event"
            onClick={() => create(selectedDate)}
            className="proto-mono absolute -top-7 right-4 flex size-14 cursor-pointer items-center justify-center bg-(--action) text-3xl font-medium text-(--action-ink) shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
            +
          </button>

          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? 'Collapse agenda' : 'Expand agenda'}
            onPointerDown={e => controls.start(e)}
            onClick={() => settle(!open)}
            className="flex h-8 w-full shrink-0 cursor-grab touch-none items-center justify-center">
            <span aria-hidden className="h-1 w-10 bg-(--line-strong)" />
          </button>

          <div onPointerDown={e => controls.start(e)} className="flex shrink-0 touch-none items-end gap-3 px-4 pb-3">
            <span className="proto-display text-6xl leading-[0.85] text-(--text)">{day.format('DD')}</span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pb-0.5">
              <span className="proto-mono text-[11px] uppercase tracking-widest text-(--text-muted)">
                {day.format('dddd')}
              </span>
              <span className="proto-mono text-xs text-(--text-faint)">
                {day.format('MMM YYYY')} · {pluralEvents(events.length)}
              </span>
            </div>
            <Link
              to={`/day/${selectedDate}`}
              className="proto-mono mr-14 flex h-11 items-center px-2 text-xs uppercase tracking-wider text-(--text-muted)">
              Open ↗
            </Link>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
            <AgendaList date={selectedDate} events={events} />
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default MobileSheetHome;
