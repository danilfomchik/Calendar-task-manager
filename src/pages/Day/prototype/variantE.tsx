// PROTOTYPE, throwaway. Variant E = one masthead (page header + hero) and D's "Day context" drawer.
// Hero: a compact week strip; today expands in place, other days show their event mix as colour bars.
// Header controls match Home (SidebarToggle hidden while the sidebar is open, green Add event).
// The drawer holds AI insight (variant A's card), forecast, Upcoming and the note.
import moment from 'moment';
import {useState} from 'react';
import {useSelector} from 'react-redux';

import SidebarToggle from '@/components/common/SidebarToggle';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {selectIsSidebarOpen} from '@/redux/sidebar/selectors';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';

import {Card, DayCtx, SummaryChips, Upcoming} from './blocks';
import {AIWow, EventsFiltered, ForecastTile, NoteOptional, QuickAddTinted} from './blocksA';
import {BackToMonth, MixBar, MobileE} from './mobileE';
import {MOCK_EVENTS, MOCK_NEIGHBOURS, WEEK_MIX} from './mock';

const Chevron = ({dir}: {dir: 'left' | 'right'}) => (
  <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.25}>
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="square" />
  </svg>
);

// Same look as Home's AddEventButton, but bound to this page's date instead of the selected one.
const AddEventDay = ({date}: {date: string}) => {
  const dispatch = useAppDispatch();
  return (
    <button
      type="button"
      onClick={() => {
        dispatch(onOpenItem(EVENT_FORM_ID));
        dispatch(setEventFormData({actionType: FormActionType.create, date}));
      }}
      className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 bg-action px-3 font-mono text-xs font-medium uppercase tracking-wider text-action-ink hover:brightness-110">
      + Add event
    </button>
  );
};

const StepEnd = ({side, label}: {side: 'prev' | 'next'; label: string}) => (
  <button
    type="button"
    aria-label={`${side === 'prev' ? 'Previous' : 'Next'} day, ${label}`}
    title={`${side === 'prev' ? 'Previous' : 'Next'} day`}
    className={cx(
      'flex w-11 shrink-0 items-center justify-center text-text-muted transition-colors hover:bg-info/10 hover:text-info',
      side === 'next' && 'border-l border-line',
    )}>
    <Chevron dir={side === 'prev' ? 'left' : 'right'} />
  </button>
);

// Hero: the whole week in one row. Today expands in place; other days are compact, clickable cells
// showing their event mix, so the week's shape (busy Friday, empty Saturday) reads at a glance.
const WeekStrip = ({d}: {d: DayCtx}) => {
  const current = moment(d.date);
  const monday = current.clone().startOf('isoWeek');
  const todayColors = MOCK_EVENTS.map(e => e.color);
  return (
    <div className="flex h-28">
      <StepEnd side="prev" label={MOCK_NEIGHBOURS.prev.label} />
      {Array.from({length: 7}, (_, i) => {
        const day = monday.clone().add(i, 'day');
        const offset = day.diff(current, 'day');
        const isWeekend = i >= 5;

        if (offset === 0) {
          return (
            <div
              key={i}
              aria-current="date"
              className="relative flex flex-[2.6] flex-col justify-between gap-2 border-x border-info/60 bg-linear-to-br from-info/20 via-info/8 to-transparent px-5 pb-3 pt-3">
              <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-info" />
              <div className="flex items-end gap-4">
                <time
                  dateTime={d.date}
                  className="font-display text-7xl font-extrabold leading-[0.78] tracking-tighter text-info">
                  {d.numeral}
                </time>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-xl font-semibold leading-tight">{d.weekday}</span>
                  <span className="truncate text-sm text-text-muted">{d.monthYear}, week 46</span>
                </div>
                <span className="ml-auto self-start text-xs font-medium text-info">Today</span>
              </div>
              <MixBar colors={todayColors} tall />
            </div>
          );
        }

        const colors = WEEK_MIX[i];
        const hint = offset === -1 ? 'Previous' : offset === 1 ? 'Next' : null;
        return (
          <button
            key={i}
            type="button"
            aria-label={`${day.format('dddd D MMMM')}, ${colors.length} events`}
            className={cx(
              'group flex min-w-0 flex-1 flex-col justify-between gap-2 border-l border-line px-3 pb-3 pt-3 text-left transition-colors hover:bg-surface-raised',
              isWeekend && 'bg-surface-sunken',
              offset < 0 ? 'text-text-faint' : 'text-text-muted',
              offset === 1 && 'border-l-0',
            )}>
            <span className="flex items-baseline justify-between gap-1 text-xs">
              {day.format('ddd')}
              {hint && (
                <span className="text-[11px] text-info opacity-0 transition-opacity group-hover:opacity-100">
                  {hint}
                </span>
              )}
            </span>
            <span className="font-display text-3xl font-extrabold leading-none group-hover:text-text">
              {day.format('D')}
            </span>
            <MixBar colors={offset < 0 ? colors.map(() => 'var(--color-line-strong)') : colors} />
          </button>
        );
      })}
      <StepEnd side="next" label={MOCK_NEIGHBOURS.next.label} />
    </div>
  );
};

const VariantE = ({d}: {d: DayCtx}) => {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className="hidden h-svh flex-col md:flex">
        <header className="border-b border-line">
          <div className={cx('flex h-22 items-center gap-0 border-b border-line px-6', !isSidebarOpen && 'gap-5')}>
            <SidebarToggle className={cx({'md:hidden': isSidebarOpen})} />
            <div className="flex flex-1 items-center gap-4">
              <BackToMonth label={d.monthYear} />
              <button
                type="button"
                aria-pressed={open}
                onClick={() => setOpen(o => !o)}
                className={cx(
                  'ml-auto inline-flex h-9 items-center gap-2 border px-3 font-mono text-xs font-medium uppercase tracking-wider transition-colors',
                  open
                    ? 'border-action text-action'
                    : 'border-line-strong text-text-muted hover:border-text-muted hover:text-text',
                )}>
                <span aria-hidden>✦</span> Day context
              </button>
              <AddEventDay date={d.date} />
            </div>
          </div>
          <WeekStrip d={d} />
        </header>

        <div className="flex min-h-0 flex-1">
          <main className="flex min-w-0 flex-1 flex-col gap-3 overflow-auto p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="font-display text-2xl font-extrabold">
                5{' '}
                <span className="font-mono text-xs font-normal uppercase tracking-widest text-text-faint">events</span>
              </p>
              <SummaryChips />
            </div>
            <QuickAddTinted />
            <EventsFiltered />
          </main>
          <aside
            aria-hidden={!open}
            className={cx(
              'shrink-0 overflow-hidden border-line transition-[width] duration-300 ease-out motion-reduce:transition-none',
              open ? 'w-80 border-l' : 'w-0',
            )}>
            <div className="flex h-full w-80 flex-col gap-3 overflow-auto p-4 *:shrink-0">
              <AIWow />
              <ForecastTile compact />
              <Card title="Upcoming">
                <Upcoming />
              </Card>
              <NoteOptional />
            </div>
          </aside>
        </div>
      </div>
      <MobileE d={d} />
    </>
  );
};

export default VariantE;
