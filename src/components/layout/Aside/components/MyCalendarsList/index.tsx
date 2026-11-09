import moment from 'moment';
import {KeyboardEvent} from 'react';
import {useSelector} from 'react-redux';

import {selectFullDate} from '@/redux/date/selectors';
import {clearActiveCalendars, toggleActiveCalendar} from '@/redux/myCalendars/myCalendarsSlice';
import {selectActiveCalendars, selectCalendarsList, selectCalendarsMap} from '@/redux/myCalendars/selectors';
import {useAppDispatch} from '@/redux/store';
import {formatDate} from '@/services/dateUtils';
import {cx} from '@/services/utils';
import {CalendarsNames} from '@/types/types';

const MyCalendarsList = () => {
  const dispatch = useAppDispatch();
  const calendarsList = useSelector(selectCalendarsList);
  const activeCalendars = useSelector(selectActiveCalendars);
  const calendarsMap = useSelector(selectCalendarsMap);
  const fullDate = useSelector(selectFullDate);

  const yearMonthKey = formatDate(moment(fullDate), 'YYYY-MM');
  const currentCalendarsData = calendarsMap[yearMonthKey];
  const hasActiveCalendars = activeCalendars.length > 0;

  const toggleCalendar = (name: CalendarsNames) => {
    dispatch(toggleActiveCalendar(name));
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLLIElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleCalendar(calendarsList[index].name);
    }
  };

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between mb-2.5 min-h-5">
        <p className="uppercase font-mono text-xs text-text-faint">My calendars</p>

        {hasActiveCalendars && (
          <button
            type="button"
            onClick={() => dispatch(clearActiveCalendars())}
            className="group flex cursor-pointer items-center gap-1 border border-line-strong bg-surface-raised px-2 py-0.5 font-mono text-[11px] leading-none text-text-muted transition-colors hover:bg-surface-overlay hover:text-text">
            <span className="flex items-center justify-center bg-line px-1 py-px text-[10px] text-text-muted group-hover:bg-line-strong">
              {activeCalendars.length}
            </span>
            Clear
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
              <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <ul role="listbox" aria-multiselectable="true" aria-label="My calendars">
        {calendarsList?.map(({name, itemColor}, index) => {
          const isSelected = activeCalendars.includes(name);
          const count = currentCalendarsData?.[name];

          return (
            <li
              key={name}
              role="option"
              tabIndex={0}
              aria-selected={isSelected}
              className={cx(
                'flex items-center gap-2 py-1 px-2 rounded-lg cursor-pointer transition-all hover:bg-surface-raised select-none',
                {
                  'bg-surface-raised border-l-2 border-action': isSelected,
                },
              )}
              onClick={() => toggleCalendar(name)}
              onKeyDown={e => handleOptionKeyDown(e, index)}>
              <div
                className="w-1.75 h-1.75 rounded-full"
                style={{
                  backgroundColor: itemColor,
                  boxShadow: isSelected ? `0 0 0 2px var(--color-surface-base), 0 0 0 3px ${itemColor}` : '',
                }}></div>
              <p className="text-text-muted font-mono text-sm">{name}</p>

              {!!count && <span className="text-text-faint font-mono text-sm/[1] ml-auto">{count}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyCalendarsList;
