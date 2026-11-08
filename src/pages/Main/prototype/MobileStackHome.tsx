// PROTOTYPE: mobile B. Selected-day hero on top, events fill the middle, Week strip docked in thumb reach.
// Swipe the dock handle up to expand the Week strip into the Month grid.
import moment from 'moment';
import {motion} from 'motion/react';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router';

import OpenSidebarBtn from '@/components/common/OpenSidebarBtn';
import {setIsCollapsed, setSelectedDate, shiftMonth, shiftWeek} from '@/redux/date/dateSlice';
import {selectFullDate, selectIsCollapsed, selectSelectedDate} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {cx} from '@/services/utils';

import {ProtoMonthGrid, ProtoWeekStrip, ProtoWeekdays} from './ProtoMonthGrid';
import {AgendaList, pluralEvents, useDayEvents, useEventForm} from './shared';

const arrow =
  'proto-mono flex size-11 cursor-pointer items-center justify-center border border-(--line-strong) text-lg text-(--text-muted) active:text-(--text)';

const MobileStackHome = () => {
  const dispatch = useAppDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const fullDate = useSelector(selectFullDate);
  const isCollapsed = useSelector(selectIsCollapsed);
  const events = useDayEvents(selectedDate);
  const {create} = useEventForm();

  // this variant starts with the Week strip docked
  useEffect(() => {
    dispatch(setIsCollapsed(true));
    return () => {
      dispatch(setIsCollapsed(false));
    };
  }, [dispatch]);

  const day = moment(selectedDate);
  const month = moment(fullDate);
  const select = (date: string) => dispatch(setSelectedDate(date));

  return (
    <div className="flex h-full flex-col pb-12">
      <header className="flex shrink-0 items-end gap-3 px-3 pt-2 pb-4">
        <div className="flex flex-col items-start gap-1">
          <div className="flex size-11 items-center">
            <OpenSidebarBtn />
          </div>
          <span className="proto-display text-[88px] leading-[0.8] text-(--text)">{day.format('DD')}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 pb-1">
          <span className="proto-mono text-xs uppercase tracking-widest text-(--text-muted)">{day.format('dddd')}</span>
          <span className="proto-mono text-xs text-(--text-faint)">
            {day.format('MMM YYYY')} · {pluralEvents(events.length)}
          </span>
        </div>
        <Link
          to={`/day/${selectedDate}`}
          className="proto-mono flex h-11 items-center px-2 text-xs uppercase tracking-wider text-(--text-muted)">
          Open ↗
        </Link>
      </header>

      <div className="relative min-h-0 flex-1 border-t border-(--line)">
        <div className="h-full overflow-y-auto px-3 pt-4 pb-24">
          <AgendaList date={selectedDate} events={events} />
        </div>

        <button
          type="button"
          aria-label="Add event"
          onClick={() => create(selectedDate)}
          className="proto-mono absolute right-4 bottom-4 flex size-14 cursor-pointer items-center justify-center bg-(--action) text-3xl font-medium text-(--action-ink) shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
          +
        </button>
      </div>

      <div className="shrink-0 border-t border-(--line-strong) bg-(--surface-raised)">
        <motion.button
          type="button"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Expand to month' : 'Collapse to week'}
          onClick={() => dispatch(setIsCollapsed(!isCollapsed))}
          onPanEnd={(_, info) => {
            if (info.offset.y < -24) dispatch(setIsCollapsed(false));
            else if (info.offset.y > 24) dispatch(setIsCollapsed(true));
          }}
          className="flex h-8 w-full cursor-grab touch-none items-center justify-center">
          <span aria-hidden className="h-1 w-10 bg-(--line-strong)" />
        </motion.button>

        <div className="flex items-center gap-2 px-3 pb-1">
          <h2 className="flex flex-1 items-baseline gap-2">
            <span className="proto-display text-2xl leading-none">{month.format('MMMM')}</span>
            <span className="proto-mono text-xs text-(--text-faint)">{month.format('YYYY')}</span>
          </h2>
          <button
            type="button"
            aria-label={isCollapsed ? 'Previous week' : 'Previous month'}
            className={arrow}
            onClick={() => dispatch(isCollapsed ? shiftWeek(-1) : shiftMonth(-1))}>
            ‹
          </button>
          <button
            type="button"
            aria-label={isCollapsed ? 'Next week' : 'Next month'}
            className={arrow}
            onClick={() => dispatch(isCollapsed ? shiftWeek(1) : shiftMonth(1))}>
            ›
          </button>
        </div>

        <div className={cx('px-10 pb-3', {'px-0': !isCollapsed})}>
          <ProtoWeekdays mode="mobile" />
          {isCollapsed ? (
            <ProtoWeekStrip selectedDate={selectedDate} onSelect={select} />
          ) : (
            <ProtoMonthGrid mode="mobile" selectedDate={selectedDate} onSelect={select} className="h-72" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileStackHome;
