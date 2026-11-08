/* eslint-disable react-refresh/only-export-components */
// PROTOTYPE: day cells. Desktop = dense chips; mobile = numeral + up to 3 dots.
import moment from 'moment';
import {memo, useLayoutEffect, useRef, useState} from 'react';
import {Link} from 'react-router';

import {cx} from '@/services/utils';

import {calendarVars, pluralEvents, useDayEvents, useEventForm, useIsDimmed} from './shared';

const CHIP_H = 20;
const CHIP_GAP = 2;

type TCellProps = {
  date: string;
  isOutside: boolean;
  isToday: boolean;
  isSelected: boolean;
  onSelect: (date: string) => void;
  onMore?: (date: string, anchor: HTMLElement) => void;
  showOpenDay?: boolean;
};

export const label = (date: string, count: number) => `${moment(date).format('dddd D MMMM')}, ${pluralEvents(count)}`;

export const numeralClass = (isToday: boolean, isOutside: boolean) =>
  cx('proto-display flex h-7 min-w-7 items-center justify-center px-1 text-[22px] leading-none', {
    'bg-(--info) text-(--info-ink)': isToday,
    'text-(--text)': !isToday && !isOutside,
    'text-(--text-faint)': !isToday && isOutside,
  });

export const DesktopDayCell = memo(
  ({date, isOutside, isToday, isSelected, onSelect, onMore, showOpenDay = false}: TCellProps) => {
    const events = useDayEvents(date);
    const isDimmed = useIsDimmed();
    const {create, edit} = useEventForm();

    const listRef = useRef<HTMLDivElement>(null);
    const [slots, setSlots] = useState(0);

    useLayoutEffect(() => {
      const el = listRef.current;
      if (!el) return;

      const measure = () => setSlots(Math.max(0, Math.floor((el.clientHeight + CHIP_GAP) / (CHIP_H + CHIP_GAP))));

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const total = events.length;
    // reserve a slot for "+N more" only when something is really hidden
    const hasOverflow = total > slots;
    const chipCount = hasOverflow ? Math.max(slots - 1, 0) : total;
    const hidden = total - chipCount;

    const stop = (e: React.MouseEvent) => e.stopPropagation();

    return (
      <div
        onClick={() => onSelect(date)}
        className={cx(
          'group relative flex min-h-0 min-w-0 cursor-pointer flex-col gap-1 border-r border-b border-(--line) p-1.5 transition-colors hover:bg-(--surface-raised)',
          {
            'bg-(--surface-sunken)': isOutside,
            'z-10 outline-2 -outline-offset-2 outline-(--action)': isSelected,
          },
        )}>
        <div className="flex h-7 shrink-0 items-center gap-1.5">
          <button
            type="button"
            aria-pressed={isSelected}
            aria-label={label(date, total)}
            onClick={() => onSelect(date)}
            className={cx(numeralClass(isToday, isOutside), 'cursor-pointer', {
              'underline decoration-(--action) decoration-2 underline-offset-4': isSelected && !isToday,
            })}>
            <time dateTime={date}>{moment(date).format('DD')}</time>
          </button>

          {total > 0 && (
            <span className="proto-mono border border-(--line-strong) px-1 text-[10px] leading-4 text-(--text-muted)">
              {total}
            </span>
          )}

          <div className="ml-auto flex items-center opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
            {showOpenDay && (
              <Link
                to={`/day/${date}`}
                title="Open day"
                aria-label={`Open ${moment(date).format('D MMMM')}`}
                onClick={stop}
                className="proto-mono flex size-6 items-center justify-center text-sm text-(--text-muted) hover:text-(--text)">
                ↗
              </Link>
            )}
            <button
              type="button"
              title="Add event"
              aria-label={`Add event on ${moment(date).format('D MMMM')}`}
              onClick={e => {
                stop(e);
                create(date);
              }}
              className="proto-mono flex size-6 cursor-pointer items-center justify-center text-base text-(--action) hover:brightness-125">
              +
            </button>
          </div>
        </div>

        <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
          {events.slice(0, chipCount).map(event => {
            const dimmed = isDimmed(event.eventCalendar);
            return (
              <button
                key={event.id}
                type="button"
                disabled={dimmed}
                title={`${event.title} · ${event.eventCalendar}`}
                onClick={e => {
                  stop(e);
                  edit(event);
                }}
                style={calendarVars(event.eventCalendar)}
                className={cx(
                  'flex h-5 w-full shrink-0 items-center gap-1.5 text-left text-xs leading-none',
                  dimmed
                    ? 'cursor-not-allowed border border-dashed border-(--line-strong) bg-transparent'
                    : 'cursor-pointer bg-(--surface-overlay) hover:bg-(--line)',
                )}>
                <span
                  aria-hidden
                  className={cx('h-full w-0.75 shrink-0', dimmed ? 'bg-transparent' : 'bg-(--calendar-color)')}
                />
                <span className={cx('truncate', dimmed ? 'text-(--text-faint) italic' : 'text-(--text)')}>
                  {event.title}
                </span>
              </button>
            );
          })}

          {hasOverflow && slots >= 1 && (
            <button
              type="button"
              onClick={e => {
                stop(e);
                onSelect(date);
                onMore?.(date, e.currentTarget);
              }}
              className="proto-mono h-5 w-full shrink-0 cursor-pointer pl-2 text-left text-[11px] leading-none text-(--text-muted) hover:text-(--text)">
              +{hidden} more
            </button>
          )}
        </div>
      </div>
    );
  },
);
DesktopDayCell.displayName = 'DesktopDayCell';

const MAX_DOTS = 3;

export const MobileDayCell = memo(({date, isOutside, isToday, isSelected, onSelect}: TCellProps) => {
  const events = useDayEvents(date);
  const isDimmed = useIsDimmed();

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={label(date, events.length)}
      onClick={() => onSelect(date)}
      className={cx('flex min-h-11 cursor-pointer flex-col items-center justify-start gap-1.5 pt-1.5', {
        'outline-2 -outline-offset-2 outline-(--action)': isSelected,
        'bg-(--surface-sunken)': isOutside,
      })}>
      <span className={cx(numeralClass(isToday, isOutside), 'h-8 min-w-8 text-xl')}>
        <time dateTime={date}>{moment(date).format('D')}</time>
      </span>

      <span className="flex h-2 items-center gap-1">
        {events.slice(0, MAX_DOTS).map(event => (
          <span
            key={event.id}
            aria-hidden
            style={calendarVars(event.eventCalendar)}
            className={cx('size-1.5 rounded-full border border-(--calendar-color)', {
              'bg-(--calendar-color)': !isDimmed(event.eventCalendar),
            })}
          />
        ))}
        {events.length > MAX_DOTS && <span className="proto-mono text-[10px] leading-none text-(--text-muted)">+</span>}
      </span>
    </button>
  );
});
MobileDayCell.displayName = 'MobileDayCell';
