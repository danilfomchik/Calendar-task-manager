import {useSelector} from 'react-redux';

import {selectMonth, selectYear} from '@/redux/date/selectors';
import {generateDatesArray} from '@/services/dateUtils';

import Day from '../Day';

const DaysList = () => {
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);

  const dates = generateDatesArray(year as string, month as string);

  return (
    <div className="grid grid-rows-6 grid-cols-7 gap-[2px] w-full min-h-[286px] h-auto md:h-full">
      {dates.map(date => (
        <Day key={date} date={date} />
      ))}
    </div>
  );
};

export default DaysList;
