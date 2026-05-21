import moment from 'moment';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import EventsList from '@/components/common/EventsList';
import ExternalPage from '@/components/ui/icons/ExternalPage';
import {useEventsList} from '@/hooks/useEventsList';
import {selectSelectedDate} from '@/redux/date/selectors';
import {formatDate} from '@/services/dateUtils';

const MobileDateInfo = () => {
  const selectedDate = useSelector(selectSelectedDate);
  const events = useEventsList(selectedDate);

  return (
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
          className="p-2 text-xs md:text-sm"
          endIcon={<ExternalPage size="size-4" />}
        />
      </div>

      <EventsList date={selectedDate} />
    </div>
  );
};

export default MobileDateInfo;
