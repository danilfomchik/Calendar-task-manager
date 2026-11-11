// PROTOTYPE, throwaway. Variant E on mobile: the week strip stays the hero (today expands in place,
// swipe for prev/next week via Home's SwipeSlide), and D's "Day context" drawer becomes a bottom sheet
// opened from a fixed button on the right, stacked above Home-style floating Add event.
import moment from 'moment';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';

import SidebarToggle from '@/components/common/SidebarToggle';
import SwipeSlide from '@/components/common/SwipeSlide';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {EVENT_FORM_ID} from '@/services/constants';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';

import {Card, DayCtx, SummaryChips, Upcoming} from './blocks';
import {AIWow, EventsFiltered, ForecastTile, NoteOptional, QuickAddTinted} from './blocksA';
import {MOCK_EVENTS, WEEK_MIX} from './mock';

// Event mix as a segmented bar: one segment per event, in its calendar colour.
export const MixBar = ({colors, tall}: {colors: string[]; tall?: boolean}) =>
  colors.length ? (
    <span aria-hidden className={cx('flex w-full gap-0.5', tall ? 'h-1.5' : 'h-1')}>
      {colors.map((c, i) => (
        <span key={i} className="flex-1" style={{background: c}} />
      ))}
    </span>
  ) : (
    <span aria-hidden className="block h-1 w-full border-t border-dashed border-line-strong" />
  );

// Home's hairline control look (ChangeMonthControl): square, line-strong border, mono uppercase label.
export const CONTROL_CLASS =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-2 border border-line-strong px-3 font-mono text-[11px] uppercase tracking-wider text-text-muted transition-colors hover:border-text-muted hover:text-text md:h-9 md:text-xs';

export const BackToMonth = ({label}: {label: string}) => {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate(-1)} className={CONTROL_CLASS}>
      <span aria-hidden>‹</span> {label}
    </button>
  );
};

// Phone week strip: no step arrows; swipe moves a week, tapping a day is the step. Today ~2.4x wide.
const WeekStripMobile = ({d, weekOffset, onSwipe}: {d: DayCtx; weekOffset: number; onSwipe: (dir: 1 | -1) => void}) => {
  const current = moment(d.date);
  const monday = current.clone().startOf('isoWeek').add(weekOffset, 'week');
  return (
    <div className="h-24 touch-pan-y select-none overflow-hidden border-b border-line">
      <SwipeSlide slideKey={monday.format('YYYY-MM-DD')} onSwipe={onSwipe} className="flex h-full">
        {Array.from({length: 7}, (_, i) => {
          const day = monday.clone().add(i, 'day');
          const offset = day.diff(current, 'day');
          if (offset === 0) {
            return (
              <div
                key={i}
                aria-current="date"
                className="relative flex flex-[2.4] flex-col justify-between border-x border-info/60 bg-linear-to-b from-info/20 to-info/5 px-3 pb-2.5 pt-2.5">
                <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-info" />
                <div className="flex items-end gap-2">
                  <time
                    dateTime={d.date}
                    className="font-display text-[52px] font-extrabold leading-[0.78] tracking-tighter text-info">
                    {d.numeral}
                  </time>
                  <span className="text-sm font-semibold leading-none">{day.format('ddd')}</span>
                </div>
                <MixBar colors={MOCK_EVENTS.map(e => e.color)} tall />
              </div>
            );
          }
          const colors = WEEK_MIX[i];
          return (
            <button
              key={i}
              type="button"
              aria-label={`${day.format('dddd D MMMM')}, ${colors.length} events`}
              className={cx(
                'flex min-w-0 flex-1 flex-col items-center justify-between px-1.5 pb-2.5 pt-2.5 active:bg-surface-raised',
                i >= 5 && 'bg-surface-sunken',
                offset < 0 ? 'text-text-faint' : 'text-text-muted',
                i > 0 && offset !== 1 && 'border-l border-line',
              )}>
              <span className="text-[11px]">{day.format('dd')}</span>
              <span className="font-display text-xl font-extrabold leading-none">{day.format('D')}</span>
              <MixBar colors={offset < 0 ? colors.map(() => 'var(--color-line-strong)') : colors} />
            </button>
          );
        })}
      </SwipeSlide>
    </div>
  );
};

export const MobileE = ({d}: {d: DayCtx}) => {
  const dispatch = useAppDispatch();
  const [sheet, setSheet] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const shownWeek = moment(d.date).add(weekOffset, 'week').isoWeek();

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheet]);

  return (
    <div className="relative flex h-svh w-full flex-col overflow-hidden md:hidden">
      <header>
        <div className="flex h-16 items-center gap-3 border-b border-line px-3">
          <SidebarToggle />
          <BackToMonth label={d.monthYear} />
          <span className="ml-auto font-mono text-[11px] uppercase tracking-wider text-text-faint">
            Week {shownWeek}
          </span>
          {weekOffset !== 0 && (
            <button type="button" onClick={() => setWeekOffset(0)} className={CONTROL_CLASS}>
              Back to {d.numeral}
            </button>
          )}
        </div>
        <WeekStripMobile d={d} weekOffset={weekOffset} onSwipe={dir => setWeekOffset(o => o + dir)} />
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-3 pb-40">
        <div className="flex flex-col gap-1">
          <span className="truncate text-lg font-semibold leading-tight">
            {d.weekday}, {d.numeral} {d.month}
          </span>
          <div className="flex items-center justify-between gap-3">
            <span className="whitespace-nowrap text-sm text-text-muted">5 events</span>
            <SummaryChips small />
          </div>
        </div>
        <QuickAddTinted />
        <EventsFiltered />
      </main>

      {/* Fixed right-side stack: Day context (opens the sheet) above Home's floating Add event */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
        <button
          type="button"
          aria-label="Day context"
          title="Day context"
          aria-expanded={sheet}
          aria-controls="day-context-sheet"
          onClick={() => setSheet(true)}
          className="flex size-14 cursor-pointer flex-col items-center justify-center gap-0.5 border border-action bg-surface-raised text-action shadow-[0_8px_20px_rgba(0,0,0,0.5)] active:bg-surface-overlay">
          <span aria-hidden className="text-xl leading-none">
            ✦
          </span>
          <span aria-hidden className="font-mono text-[9px] uppercase tracking-wider">
            Context
          </span>
        </button>
        <button
          type="button"
          aria-label="Add event"
          onClick={() => {
            dispatch(onOpenItem(EVENT_FORM_ID));
            dispatch(setEventFormData({actionType: FormActionType.create, date: d.date}));
          }}
          className="flex size-14 cursor-pointer items-center justify-center bg-action font-mono text-3xl font-medium text-action-ink shadow-[0_8px_20px_rgba(0,0,0,0.5)] active:brightness-110">
          +
        </button>
      </div>

      {/* Bottom sheet: the desktop drawer's contents */}
      <div
        aria-hidden
        onClick={() => setSheet(false)}
        className={cx(
          'absolute inset-0 z-40 bg-black/60 transition-opacity duration-300 motion-reduce:transition-none',
          sheet ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <section
        id="day-context-sheet"
        role="dialog"
        aria-label="Day context"
        aria-hidden={!sheet}
        {...(!sheet && {inert: ''})} // React 18 types lack `inert`
        className={cx(
          'absolute inset-x-0 bottom-0 z-50 flex max-h-[85%] flex-col border-t border-line-strong bg-surface-base transition-transform duration-300 ease-out motion-reduce:transition-none',
          sheet ? 'translate-y-0' : 'translate-y-full',
        )}>
        <button
          type="button"
          onClick={() => setSheet(false)}
          className="flex min-h-11 shrink-0 items-center justify-between px-4 text-sm font-semibold">
          Day context
          <span className="text-xs font-normal text-text-muted">Close</span>
        </button>
        <div className="flex flex-col gap-3 overflow-auto px-3 pb-4 *:shrink-0">
          <AIWow />
          <ForecastTile compact />
          <Card title="Upcoming">
            <Upcoming />
          </Card>
          <NoteOptional />
        </div>
      </section>
    </div>
  );
};
