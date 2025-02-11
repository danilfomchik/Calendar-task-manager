import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';

import Dropdown from '@/components/Dropdown';
import {setFullDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectMonth, selectYear} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {formatDate} from '@/services/utils';

const CalendarDatePicker = () => {
    const dispatch = useAppDispatch();
    const currentFullDate = useSelector(selectFullDate);
    const year = useSelector(selectYear);
    const month = useSelector(selectMonth);

    const monthsOptions = useMemo(() => moment.months(), []);
    const yearsOptions = useMemo(() => {
        const currentYear = moment().year();
        const startYear = currentYear - 10; // Adjust the range as needed
        return Array.from({length: 30}, (_, i) => (startYear + i).toString());
    }, []);

    const onMonthChange = (newMonth: string) => {
        const newMonthIndex = formatDate(moment(currentFullDate).month(newMonth), 'M');

        const changedDate = moment(currentFullDate).month(+newMonthIndex - 1);
        const changedFullDate = formatDate(changedDate, 'YYYY-MM-DD');

        dispatch(setFullDate(changedFullDate));
    };

    const onYearChange = (newYear: string) => {
        const changedDate = moment(currentFullDate).year(+newYear);
        const changedFullDate = formatDate(changedDate, 'YYYY-MM-DD');

        dispatch(setFullDate(changedFullDate));
    };

    return (
        <div className="flex gap-2 relative self-stretch">
            <Dropdown
                selectedOption={month || ''}
                changeSelectedOption={onMonthChange}
                options={monthsOptions}
                placeholder="Pick month"
                className="text-[16px]"
            />
            <Dropdown
                selectedOption={year || ''}
                changeSelectedOption={onYearChange}
                options={yearsOptions}
                placeholder="Pick year"
                className="text-[16px]"
            />
        </div>
    );
};

export default CalendarDatePicker;
