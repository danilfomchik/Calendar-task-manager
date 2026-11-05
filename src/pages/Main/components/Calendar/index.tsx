import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import Divider from '@/components/ui/Divider';
import ArrowTop from '@/components/ui/icons/ArrowTop';
import {setIsCollapsed} from '@/redux/date/dateSlice';
import {selectIsCollapsed} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {cx} from '@/services/utils';

import MobileDateInfo from '../MobileDateInfo';
import DaysList from './DaysList';
import WeekDays from './WeekDays';

const Calendar = () => {
  const dispatch = useAppDispatch();
  const isCollapsed = useSelector(selectIsCollapsed);

  return (
    <div className="flex flex-col w-full items-center overflow-x-auto max-md:pb-5 h-[calc(100vh-var(--height-header))]">
      <div className="flex flex-col w-full md:h-full gap-2 items-center px-3 md:px-0 pt-2 overflow-hidden">
        <WeekDays />
        <DaysList />
      </div>

      <Divider
        className={cx('mb-4 md:hidden!', {
          'my-4': isCollapsed,
        })}>
        <Button
          startIcon={
            <div className={`transition-all ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}>
              <ArrowTop size="size-4" />
            </div>
          }
          // TODO: move [#9a9aa3] into separate var
          className="p-2 text-[#9a9aa3] hover:bg-white/6"
          onClick={() => dispatch(setIsCollapsed(!isCollapsed))}
        />
      </Divider>

      <MobileDateInfo />
    </div>
  );
};

export default Calendar;
