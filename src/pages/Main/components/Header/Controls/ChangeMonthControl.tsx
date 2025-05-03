import moment from 'moment';
import {useSelector} from 'react-redux';

import Button from '@/components/Button';
import ArrowLeft from '@/icons/ArrowLeft';
import ArrowRight from '@/icons/ArrowRight';
import {setFullDate} from '@/redux/date/dateSlice';
import {selectFullDate} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {formatDate, getDate} from '@/services/utils';

enum MonthDirection {
    NEXT = 'next',
    PREV = 'prev',
}

const ChangeMonthControl = () => {
    const dispatch = useAppDispatch();
    const fullDate = useSelector(selectFullDate);

    const onChangeMonth = (type: MonthDirection) => {
        let monthIndex = 0;

        if (type === MonthDirection.NEXT) {
            monthIndex = 1;
        } else {
            monthIndex = -1;
        }

        const changedDate = moment(fullDate).add(monthIndex, 'M');
        const changedFullDate = formatDate(changedDate, 'YYYY-MM-DD');

        dispatch(setFullDate(changedFullDate));
    };

    const onSwithToToday = () => {
        const currentFullDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');

        dispatch(setFullDate(currentFullDate));
    };

    return (
        <div className="flex">
            <Button
                startIcon={<ArrowLeft size="size-4" />}
                className="rounded-none p-[8px] rounded-s-lg"
                onClick={() => onChangeMonth(MonthDirection.PREV)}
            />
            <Button text="today" className="rounded-none text-sm py-[8px] px-[10px]" onClick={onSwithToToday} />
            <Button
                endIcon={<ArrowRight size="size-4" />}
                className="rounded-none p-[8px] rounded-e-lg"
                onClick={() => onChangeMonth(MonthDirection.NEXT)}
            />
        </div>
    );
};

export default ChangeMonthControl;
