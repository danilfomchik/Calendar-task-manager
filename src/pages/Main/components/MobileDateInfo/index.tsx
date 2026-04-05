import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import EventsList from '@/components/common/EventsList';
import ExternalPage from '@/components/ui/icons/ExternalPage';
import {selectSelectedDate} from '@/redux/date/selectors';

const MobileDateInfo = () => {
  const selectedDate = useSelector(selectSelectedDate);

  return (
    <div className="md:hidden flex-1 mt-1.5 min-h-0 w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">
          Events for <span className="whitespace-nowrap">{selectedDate}</span>
        </h3>

        <Button
          kind="link"
          to={`/day/${selectedDate}`}
          text="Edit events"
          className="p-2 text-[14px]"
          endIcon={<ExternalPage size="size-4" />}
        />
      </div>

      <EventsList date={selectedDate} />
    </div>
  );
};

export default MobileDateInfo;
