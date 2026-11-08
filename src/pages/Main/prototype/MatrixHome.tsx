// PROTOTYPE: variant E "Matrix". Rows = calendars, columns = days of the month; a cell is a block sized by how many
// events that calendar has that day. Answers "where is my month heavy, and in which calendar" at a glance.
// The selected day opens below, split by calendar. Mobile transposes it: rows = days, columns = calendars.
import moment from 'moment';
import {memo, useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router';

import {setSelectedDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectSelectedDate} from '@/redux/date/selectors';
import {TEvent} from '@/redux/events/types';
import {useAppDispatch} from '@/redux/store';
import {defaultCalendars} from '@/services/constants';
import {cx} from '@/services/utils';
import {CalendarsNames} from '@/types/types';

import ProtoHeader from './ProtoHeader';
import {
  AgendaItem,
  AgendaList,
  PrimaryButton,
  calendarVars,
  pluralEvents,
  todayStr,
  useDayEvents,
  useEventForm,
  useIsDimmed,
} from './shared';

const LANE_H = 'h-12';

const countFor = (events: TEvent[], calendar: CalendarsNames) =>
  events.filter(e => e.eventCalendar === calendar).length;

// a block per calendar per day: width of the fill grows with the count, number inside
const Block = ({count, calendar, className}: {count: number; calendar: CalendarsNames; className?: string}) => {
  const dimmed = useIsDimmed()(calendar);

  return (
    <span
      aria-hidden
      style={calendarVars(calendar)}
      className={cx(
        'proto-mono flex items-center justify-center text-[13px] font-medium leading-none',
        count === 0 && 'border-t border-(--line)',
        count > 0 &&
          (dimmed
            ? 'border border-dashed border-(--calendar-color) text-(--text-faint)'
            : 'bg-(--calendar-color) text-(--surface-sunken)'),
        className,
      )}>
      {count > 0 ? count : ''}
    </span>
  );
};

type TColProps = {date: string; isToday: boolean; isSelected: boolean; onSelect: (date: string) => void};

const DayColumn = memo(({date, isToday, isSelected, onSelect}: TColProps) => {
  const events = useDayEvents(date);
  const day = moment(date);
  const isWeekend = day.day() === 0 || day.day() === 6;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={`${day.format('dddd D MMMM')}, ${pluralEvents(events.length)}`}
      onClick={() => onSelect(date)}
      className={cx(
        'group flex min-w-0 flex-1 cursor-pointer flex-col border-r border-(--line) hover:bg-(--surface-raised)',
        {
          'bg-(--surface-sunken)': isWeekend,
          'relative z-10 outline-2 -outline-offset-2 outline-(--action)': isSelected,
        },
      )}>
      <span className="flex h-14 flex-col items-center justify-center gap-1 border-b border-(--line-strong)">
        <span className="proto-mono text-[10px] leading-none text-(--text-faint)">{day.format('dd')[0]}</span>
        <span
          className={cx('proto-display flex h-6 min-w-6 items-center justify-center px-0.5 text-[15px] leading-none', {
            'bg-(--info) text-(--info-ink)': isToday,
          })}>
          <time dateTime={date}>{day.format('D')}</time>
        </span>
      </span>
      {defaultCalendars.map(c => (
        <span key={c.name} className={cx('flex items-stretch p-0.75', LANE_H)}>
          <Block count={countFor(events, c.name)} calendar={c.name} className="w-full" />
        </span>
      ))}
    </button>
  );
});
DayColumn.displayName = 'DayColumn';

const LaneLabels = () => (
  <div className="flex w-36 shrink-0 flex-col border-r border-(--line-strong)">
    <div className="h-14 border-b border-(--line-strong)" />
    {defaultCalendars.map(c => (
      <div key={c.name} style={calendarVars(c.name)} className={cx('flex items-center gap-2 px-4', LANE_H)}>
        <span aria-hidden className="size-2.5 bg-(--calendar-color)" />
        <span className="text-sm font-semibold">{c.name}</span>
      </div>
    ))}
  </div>
);

// the selected day, split by calendar
const DayDetail = ({date}: {date: string}) => {
  const events = useDayEvents(date);
  const {create} = useEventForm();
  const day = moment(date);

  return (
    <section aria-label={`Events on ${day.format('D MMMM')}`} className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-4 border-b border-(--line) px-6 py-3">
        <span className="proto-display text-5xl leading-none">{day.format('DD')}</span>
        <div className="flex flex-col">
          <span className="text-base font-semibold">{day.format('dddd')}</span>
          <span className="proto-mono text-xs text-(--text-faint)">{pluralEvents(events.length)}</span>
        </div>
        <Link to={`/day/${date}`} className="proto-mono ml-auto text-xs text-(--text-muted) hover:text-(--text)">
          Open day ↗
        </Link>
        <PrimaryButton onClick={() => create(date)}>+ Add event</PrimaryButton>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-4 overflow-y-auto">
        {defaultCalendars.map(c => {
          const list = events.filter(e => e.eventCalendar === c.name);

          return (
            <div
              key={c.name}
              style={calendarVars(c.name)}
              className="flex flex-col gap-1.5 border-r border-(--line) p-3">
              <h3 className="proto-mono flex items-center gap-2 pb-1 text-xs text-(--text-muted)">
                <span aria-hidden className="size-2 bg-(--calendar-color)" />
                {c.name}
                <span className="ml-auto text-(--text-faint)">{list.length}</span>
              </h3>
              {list.length === 0 ? (
                <p className="proto-mono text-xs text-(--text-faint)">Nothing planned</p>
              ) : (
                list.map(event => <AgendaItem key={event.id} event={event} />)
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const DesktopMatrix = ({
  days,
  selectedDate,
  onSelect,
}: {
  days: string[];
  selectedDate: string;
  onSelect: (d: string) => void;
}) => {
  const today = todayStr();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 border-b border-(--line-strong)">
        <LaneLabels />
        {days.map(date => (
          <DayColumn
            key={date}
            date={date}
            isToday={date === today}
            isSelected={date === selectedDate}
            onSelect={onSelect}
          />
        ))}
      </div>
      <DayDetail date={selectedDate} />
    </div>
  );
};

// ---- mobile: rows = days, columns = calendars ----

const MobileRow = memo(({date, isToday, isSelected, onSelect}: TColProps) => {
  const events = useDayEvents(date);
  const {create} = useEventForm();
  const day = moment(date);

  return (
    <div data-selected={isSelected} className="border-b border-(--line)">
      <button
        type="button"
        aria-pressed={isSelected}
        aria-label={`${day.format('dddd D MMMM')}, ${pluralEvents(events.length)}`}
        onClick={() => onSelect(date)}
        className={cx('grid h-12 w-full cursor-pointer grid-cols-[3.75rem_repeat(4,1fr)] items-stretch', {
          'bg-(--surface-raised) outline-2 -outline-offset-2 outline-(--action)': isSelected,
        })}>
        <span className="flex items-center gap-1.5 pl-3">
          <span
            className={cx('proto-display flex h-7 min-w-7 items-center justify-center text-xl leading-none', {
              'bg-(--info) text-(--info-ink)': isToday,
            })}>
            {day.format('D')}
          </span>
          <span className="proto-mono text-[10px] text-(--text-faint)">{day.format('dd')}</span>
        </span>
        {defaultCalendars.map(c => (
          <span key={c.name} className="flex items-stretch p-1.25">
            <Block count={countFor(events, c.name)} calendar={c.name} className="w-full" />
          </span>
        ))}
      </button>

      {isSelected && (
        <div className="flex flex-col gap-3 border-t border-(--line-strong) bg-(--surface-sunken) p-3">
          <AgendaList date={date} events={events} />
          <PrimaryButton className="h-11" onClick={() => create(date)}>
            + Add event
          </PrimaryButton>
        </div>
      )}
    </div>
  );
});
MobileRow.displayName = 'MobileRow';

const MobileMatrix = ({
  days,
  selectedDate,
  onSelect,
}: {
  days: string[];
  selectedDate: string;
  onSelect: (d: string) => void;
}) => {
  const today = todayStr();
  const ref = useRef<HTMLDivElement>(null);
  const monthKey = days[0]?.slice(0, 7);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[data-selected="true"]')?.scrollIntoView({block: 'center'});
    // only when the month changes
  }, [monthKey]);

  return (
    <div ref={ref} className="min-h-0 flex-1 overflow-y-auto">
      <div className="proto-mono sticky top-0 z-20 grid grid-cols-[3.75rem_repeat(4,1fr)] border-b border-(--line-strong) bg-(--surface-base) py-2 text-[10px] text-(--text-muted)">
        <span />
        {defaultCalendars.map(c => (
          <span key={c.name} style={calendarVars(c.name)} className="flex items-center justify-center gap-1">
            <span aria-hidden className="size-1.5 bg-(--calendar-color)" />
            {c.name.slice(0, 4)}
          </span>
        ))}
      </div>
      {days.map(date => (
        <MobileRow
          key={date}
          date={date}
          isToday={date === today}
          isSelected={date === selectedDate}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

const MatrixHome = ({compact}: {compact: boolean}) => {
  const dispatch = useAppDispatch();
  const fullDate = useSelector(selectFullDate);
  const selectedDate = useSelector(selectSelectedDate);

  const month = moment(fullDate).startOf('month');
  const days = Array.from({length: month.daysInMonth()}, (_, i) => month.clone().add(i, 'days').format('YYYY-MM-DD'));
  // the selected day may sit in another month; the detail panel still follows it
  const select = (date: string) => dispatch(setSelectedDate(date));

  return (
    <div className={cx('flex h-full flex-col', {'pb-14': compact})}>
      <ProtoHeader compact={compact} />
      {compact ? (
        <MobileMatrix days={days} selectedDate={selectedDate} onSelect={select} />
      ) : (
        <DesktopMatrix days={days} selectedDate={selectedDate} onSelect={select} />
      )}
    </div>
  );
};

export default MatrixHome;
