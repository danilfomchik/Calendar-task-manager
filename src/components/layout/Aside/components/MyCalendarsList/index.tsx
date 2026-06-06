import moment from 'moment';
import {KeyboardEvent} from 'react';
import {useSelector} from 'react-redux';

import {selectFullDate} from '@/redux/date/selectors';
import {setSelectedCalendar} from '@/redux/myCalendars/myCalendarsSlice';
import {selectCalendarsList, selectCalendarsMap, selectSelectedCalendar} from '@/redux/myCalendars/selectors';
import {useAppDispatch} from '@/redux/store';
import {formatDate} from '@/services/dateUtils';
import {cx} from '@/services/utils';
import {CalendarsNames} from '@/types/types';

const MyCalendarsList = () => {
  const dispatch = useAppDispatch();
  const calendarsList = useSelector(selectCalendarsList);
  const selectedCalendar = useSelector(selectSelectedCalendar);
  const calendarsMap = useSelector(selectCalendarsMap);
  const fullDate = useSelector(selectFullDate);

  const yearMonthKey = formatDate(moment(fullDate), 'YYYY-MM');
  const currentCalendarsData = calendarsMap[yearMonthKey];

  const selectCalendar = (name: CalendarsNames) => {
    if (selectedCalendar === name) {
      dispatch(setSelectedCalendar(null));
    } else {
      dispatch(setSelectedCalendar(name));
    }
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLLIElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectCalendar(calendarsList[index].name);
      return;
    } else {
      return; // Ignore other keys
    }
  };

  return (
    <div className="px-4 py-5">
      <p className="uppercase text-xs text-[#444444] mb-[10px]">My calendars</p>

      <ul role="list">
        {calendarsList?.map(({name, itemColor}, index) => {
          const isSelected = selectedCalendar === name;
          const count = currentCalendarsData?.[name];

          return (
            <li
              key={name}
              role="option"
              tabIndex={0}
              aria-selected={isSelected}
              className={cx(
                'flex items-center gap-2 py-1 px-2 rounded-lg cursor-pointer transition-all hover:bg-[#0f0f0f] select-none outline-none focus:bg-[#0f0f0f]',
                {
                  'bg-[#0f0f0f]': isSelected,
                },
              )}
              onClick={() => selectCalendar(name)}
              onKeyDown={e => handleOptionKeyDown(e, index)}>
              <div
                className="w-[7px] h-[7px] rounded-full"
                style={{
                  backgroundColor: itemColor,
                  boxShadow: isSelected ? `0 0 0 2px #0a0a0a, 0 0 0 3px ${itemColor}` : '',
                }}></div>
              <p className="text-gray-400 text-[15px]">{name}</p>

              {!!count && <span className="text-[#444444] text-sm/[1] ml-auto">{count}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyCalendarsList;
