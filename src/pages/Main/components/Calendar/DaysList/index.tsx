import {useSelector} from 'react-redux';

import {selectMonth, selectYear} from '@/redux/date/selectors';
import {useScreenSize} from '@/services/hooks';
import {generateDatesArray} from '@/services/utils';

import Day from '../Day';

const DaysList = () => {
    const screenSize = useScreenSize();
    const year = useSelector(selectYear);
    const month = useSelector(selectMonth);

    const dates = generateDatesArray(year as string, month as string);

    return (
        <div
            className={`grid grid-rows-6 grid-cols-7 gap-[2px] w-full sm:h-full ${screenSize === 'xs' ? 'h-[calc(100vh-250px)]' : ''}`}>
            {dates.map(date => (
                <Day key={date} date={date} />
            ))}
        </div>
    );
};

export default DaysList;
