import {useScreenSize} from '@/services/hooks';
import {getWeekDays} from '@/services/utils';

const WeekDays = () => {
    const weekDays = getWeekDays();
    const screenSize = useScreenSize();

    return (
        <div className="grid grid-cols-7 w-full divide-x-2 divide-secondaryBackgroundColor">
            {weekDays.map(weekday => (
                <span key={weekday} className="flex flex-1 justify-center px-2">
                    {screenSize === 'sm' ? weekday.slice(0, 3) : screenSize === 'xs' ? weekday.slice(0, 1) : weekday}
                </span>
            ))}
        </div>
    );
};

export default WeekDays;
