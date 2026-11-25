import {useId} from 'react';
import {useSelector} from 'react-redux';

import {selectFullDate} from '@/redux/date/selectors';
import {clearActiveCalendars, toggleActiveCalendar} from '@/redux/myCalendars/myCalendarsSlice';
import {selectActiveCalendars, selectCalendarsList, selectCalendarsMap} from '@/redux/myCalendars/selectors';
import {useAppDispatch} from '@/redux/store';
import {eventsNoun, getYearMonthKey} from '@/services/dateUtils';
import {cx} from '@/services/utils';
import {CalendarsNames} from '@/types/types';

const MyCalendarsList = () => {
  const dispatch = useAppDispatch();
  const calendarsList = useSelector(selectCalendarsList);
  const activeCalendars = useSelector(selectActiveCalendars);
  const calendarsMap = useSelector(selectCalendarsMap);
  const fullDate = useSelector(selectFullDate);

  const yearMonthKey = getYearMonthKey(fullDate);
  const currentCalendarsData = calendarsMap[yearMonthKey];
  const hasActiveCalendars = activeCalendars.length > 0;

  const labelId = useId();

  const toggleCalendar = (name: CalendarsNames) => {
    dispatch(toggleActiveCalendar(name));
  };

  // The calendar filter: each row is a toggle button (aria-pressed), so it is announced as a filter switched on or
  // off rather than as a selected option. Pressed rows keep their raised fill, green left bar and ringed dot.
  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-2.5 min-h-5">
        <p id={labelId} className="text-caption text-text-faint">
          My calendars
          <span className="sr-only"> filter</span>
        </p>

        {hasActiveCalendars && (
          <button
            type="button"
            aria-label={`Clear calendar filter, ${activeCalendars.length} on`}
            onClick={() => dispatch(clearActiveCalendars())}
            className="group flex h-6 max-md:min-h-11 cursor-pointer items-center gap-1.5 border border-line-strong px-2 text-caption text-text-muted transition-colors hover:border-text-muted hover:text-text">
            <span className="flex items-center justify-center bg-surface-overlay px-1 py-px text-caption tabular-nums text-text">
              {activeCalendars.length}
            </span>
            Clear
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
              <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <ul role="group" aria-labelledby={labelId}>
        {calendarsList?.map(({name, itemColor}) => {
          const isSelected = activeCalendars.includes(name);
          const count = currentCalendarsData?.[name];

          return (
            <li key={name}>
              <button
                type="button"
                aria-pressed={isSelected}
                className={cx(
                  'relative flex w-full min-h-11 md:min-h-9 items-center gap-2.5 px-2.5 text-left cursor-pointer transition-colors hover:bg-surface-raised select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-action',
                  {
                    'bg-surface-raised before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-action':
                      isSelected,
                  },
                )}
                onClick={() => toggleCalendar(name)}>
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: itemColor,
                    boxShadow: isSelected ? `0 0 0 2px var(--color-surface-raised), 0 0 0 3px ${itemColor}` : '',
                  }}
                />
                <span className={cx('text-para-m', isSelected ? 'text-text' : 'text-text-muted')}>{name}</span>

                {!!count && (
                  <span className="text-text-faint text-caption tabular-nums ml-auto">
                    {count}
                    <span className="sr-only"> {eventsNoun(count)} this month</span>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyCalendarsList;
