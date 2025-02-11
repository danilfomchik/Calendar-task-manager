import moment from 'moment';

import {Months} from '@/services/types';

const months: {[key in Months]: number} = {
    [Months.Jan]: 1,
    [Months.Feb]: 2,
    [Months.Mar]: 3,
    [Months.Apr]: 4,
    [Months.May]: 5,
    [Months.Jun]: 6,
    [Months.Jul]: 7,
    [Months.Aug]: 8,
    [Months.Sep]: 9,
    [Months.Oct]: 10,
    [Months.Nov]: 11,
    [Months.Dec]: 12,
};

const Calendar = () => {
    return (
        <div className="flex-1">
            {moment(new Date()).format('MMMM Do YYYY')} {months.toString()}
        </div>
    );
};

export default Calendar;
