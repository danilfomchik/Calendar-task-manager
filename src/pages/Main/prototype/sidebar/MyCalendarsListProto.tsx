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

const MyCalendarsListProto = () => {
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
        <p className="proto-mono uppercase text-[11px] tracking-widest text-(--text-faint)">My calendars</p>

        {hasActiveCalendars && (
          <button
            type="button"
            onClick={() => dispatch(clearActiveCalendars())}
            className="proto-mono group flex h-6 cursor-pointer items-center gap-1.5 border border-(--line-strong) px-2 text-[11px] uppercase leading-none tracking-wider text-(--text-muted) transition-colors hover:border-(--text-muted) hover:text-(--text)">
            <span className="flex items-center justify-center bg-(--surface-overlay) px-1 py-px text-[10px] text-(--text)">
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
                'relative flex min-h-9 items-center gap-2.5 px-2.5 cursor-pointer transition-colors hover:bg-(--surface-raised) select-none',
                {
                  'bg-(--surface-raised) before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-(--action)':
                    isSelected,
                },
              )}
              onClick={() => toggleCalendar(name)}
              onKeyDown={e => handleOptionKeyDown(e, index)}>
              <div
                className="size-2 rounded-full"
                style={{
                  backgroundColor: itemColor,
                  boxShadow: isSelected ? `0 0 0 2px var(--surface-raised), 0 0 0 3px ${itemColor}` : '',
                }}></div>
              <p className={cx('text-[15px]', isSelected ? 'text-(--text)' : 'text-(--text-muted)')}>{name}</p>

              {!!count && <span className="proto-mono ml-auto text-xs/[1] text-(--text-faint)">{count}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyCalendarsListProto;
