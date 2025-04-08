import moment from 'moment';
import {useCallback, useMemo} from 'react';
import {useSelector} from 'react-redux';

import Dropdown from '@/components/inputs/Dropdown';
import {setFullDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectMonth, selectYear} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {formatDate, getMonthsOptions, getYearsOptions} from '@/services/utils';

const CalendarDatePicker = () => {
    const dispatch = useAppDispatch();
    const currentFullDate = useSelector(selectFullDate);
    const year = useSelector(selectYear);
    const month = useSelector(selectMonth);

    const monthsOptions = useMemo(() => getMonthsOptions(), []);
    const yearsOptions = useMemo(() => getYearsOptions(), []);

    const onMonthChange = useCallback(
        (newMonth: string) => {
            const newMonthIndex = formatDate(moment(currentFullDate).month(newMonth), 'M');

            const changedDate = moment(currentFullDate).month(+newMonthIndex - 1);
            const changedFullDate = formatDate(changedDate, 'YYYY-MM-DD');

            dispatch(setFullDate(changedFullDate));
        },
        [currentFullDate, dispatch],
    );

    const onYearChange = useCallback(
        (newYear: string) => {
            const changedDate = moment(currentFullDate).year(+newYear);
            const changedFullDate = formatDate(changedDate, 'YYYY-MM-DD');

            dispatch(setFullDate(changedFullDate));
        },
        [currentFullDate, dispatch],
    );

    return (
        <div className="flex gap-2 relative self-stretch">
            <Dropdown
                selectedOption={month || ''}
                onChange={onMonthChange}
                options={monthsOptions}
                placeholder="Pick month"
                className="text-[16px]"
            />
            <Dropdown
                selectedOption={year || ''}
                onChange={onYearChange}
                options={yearsOptions}
                placeholder="Pick year"
                className="text-[16px]"
            />
        </div>
    );
};

export default CalendarDatePicker;
