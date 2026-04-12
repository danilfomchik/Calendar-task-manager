import {useSelector} from 'react-redux';

import {setSelectedCalendar} from '@/redux/myCalendars/myCalendarsSlice';
import {selectCalendarsList, selectSelectedCalendar} from '@/redux/myCalendars/selectors';
import {useAppDispatch} from '@/redux/store';
import {CalendarsNames} from '@/services/types';
import {cx} from '@/services/utils';

const MyCalendarsList = () => {
  const dispatch = useAppDispatch();
  // TODO: for day page - filter by date
  const calendarsList = useSelector(selectCalendarsList);
  const selectedCalendar = useSelector(selectSelectedCalendar);

  const selectCalendar = (name: CalendarsNames) => {
    if (selectedCalendar === name) {
      dispatch(setSelectedCalendar(null));
    } else {
      dispatch(setSelectedCalendar(name));
    }
  };

  return (
    <div className="px-4 py-5">
      <p className="uppercase text-xs text-[#444444] mb-[10px]">My calendars</p>

      <div>
        {calendarsList?.map(({name, count, itemColor}) => {
          const isSelected = selectedCalendar === name;

          return (
            <div
              key={name}
              className={cx(
                'flex items-center gap-2 py-1 px-2 rounded-lg cursor-pointer transition-all hover:bg-[#0f0f0f] select-none',
                {
                  'bg-[#0f0f0f]': isSelected,
                },
              )}
              onClick={() => selectCalendar(name)}>
              <div
                className="w-[7px] h-[7px] rounded-full"
                style={{
                  backgroundColor: itemColor,
                  boxShadow: isSelected ? `0 0 0 2px #0a0a0a, 0 0 0 3px ${itemColor}` : '',
                }}></div>
              <p className="text-gray-400 text-[15px]">{name}</p>
              <span className="text-[#444444] text-sm/[1] ml-auto">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyCalendarsList;
