import moment from 'moment';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import EventsList from '@/components/common/EventsList';
import ExternalPage from '@/components/ui/icons/ExternalPage';
import {useEventsList} from '@/hooks/useEventsList';
import {selectSelectedDate} from '@/redux/date/selectors';
import {formatDate} from '@/services/dateUtils';

import AddEvent from '../Header/Controls/AddEvent';

const MobileDateInfo = () => {
  const selectedDate = useSelector(selectSelectedDate);
  const events = useEventsList(selectedDate);

  return (
    <>
      <div className="md:hidden flex-1 min-h-0 w-full flex flex-col gap-4 px-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs md:text-sm text-[#444444] uppercase">
            <div className="flex items-center gap-1">
              <span>{formatDate(moment(selectedDate), 'MMMM')}</span>
              <span>{formatDate(moment(selectedDate), 'YYYY')}</span>
            </div>
            ·
            <div className="flex items-center gap-1">
              <span>{events?.length}</span>
              <span>Events</span>
            </div>
          </div>

          <Button
            kind="link"
            to={`/day/${selectedDate}`}
            text="Edit events"
            className="py-1 px-2 text-[10px]/[1.1] md:text-sm"
            endIcon={<ExternalPage size="size-3" />}
          />
        </div>

        <EventsList date={selectedDate} />
      </div>

      <AddEvent
        date={selectedDate}
        className="hidden max-md:flex self-center max-md:w-[min(50%,250px)] rounded-[100px] h-11 py-3 px-9 mt-5"
      />
    </>
  );
};

export default MobileDateInfo;
