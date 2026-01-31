import {useSelector} from 'react-redux';

import Button from '@/components/Button';
import EventsList from '@/components/EventsList';
import ExternalPage from '@/icons/ExternalPage';
import {selectSelectedDate} from '@/redux/date/selectors';

const MobileDateInfo = () => {
  const selectedDate = useSelector(selectSelectedDate);

  return (
    <div className="md:hidden flex-1 mt-4 min-h-0 w-full flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-bold">Events for {selectedDate}</h3>

        <Button
          kind="link"
          to={`/day/${selectedDate}`}
          variant="secondary"
          text="Edit events"
          endIcon={<ExternalPage size="size-5" />}
        />
      </div>

      <EventsList date={selectedDate} />
    </div>
  );
};

export default MobileDateInfo;
