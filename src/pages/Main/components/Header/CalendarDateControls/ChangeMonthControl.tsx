import {useSelector} from 'react-redux';
import moment from 'moment';

import ArrowRight from '@/icons/ArrowRight';
import ArrowLeft from '@/icons/ArrowLeft';
import Button from '@/components/Button';
import {useAppDispatch} from '@/redux/store';
import {setFullDate} from '@/redux/date/dateSlice';
import {selectFullDate} from '@/redux/date/selectors';
import {currentDate, formatDate} from '@/services/utils';

const ChangeMonthControl = () => {
    const dispatch = useAppDispatch();
    const fullDate = useSelector(selectFullDate);

    const onChangeMonth = (type: 'next' | 'prev') => {
        let monthIndex = 0;

        if (type === 'next') {
            monthIndex = 1;
        } else {
            monthIndex = -1;
        }

        const changedDate = moment(fullDate).add(monthIndex, 'M');
        const changedFullDate = formatDate(changedDate, 'YYYY-MM-DD');

        dispatch(setFullDate(changedFullDate));
    };

    const onSwithToToday = () => {
        const currentFullDate = formatDate(currentDate, 'YYYY-MM-DD');

        dispatch(setFullDate(currentFullDate));
    };

    return (
        <div className="flex">
            <Button
                variant="primary"
                icon={<ArrowLeft size="size-4" />}
                className="rounded-none p-[8px] rounded-s-lg"
                onClick={() => onChangeMonth('prev')}
            />
            <Button
                variant="primary"
                text="today"
                className="rounded-none text-sm py-[8px] px-[10px]"
                onClick={onSwithToToday}
            />
            <Button
                variant="primary"
                icon={<ArrowRight size="size-4" />}
                className="rounded-none p-[8px] rounded-e-lg"
                onClick={() => onChangeMonth('next')}
            />
        </div>
    );
};

export default ChangeMonthControl;
