import {useNavigate, useParams} from 'react-router';

import Button from '@/components/Button';
import Container from '@/components/Container';
import EventsList from '@/components/EventsList';
import ArrowLeft from '@/icons/ArrowLeft';

import AddEvent from '../Main/components/Header/Controls/AddEvent';

// separate branches TODO
// add correct selectedDate handling (on refresh) - on separate branch
// add elevenlabs

const DayPage = () => {
  const navigate = useNavigate();
  const {date} = useParams<{date: string}>();

  const handleReturn = () => {
    navigate(-1);
  };

  return (
    <Container className="w-full file:flex flex-row gap-10 h-screen py-[15px] overflow-x-hidden">
      <div className="flex flex-col gap-8 max-h-full">
        <div className="flex items-center justify-between gap-4">
          <Button text="Return back" onClick={handleReturn} startIcon={<ArrowLeft size="size-4" />} className="w-fit" />
          <AddEvent date={date} className="max-md:w-fit" />
        </div>

        <h3 className="text-lg font-bold">
          Events for <span className="whitespace-nowrap">{date}</span>
        </h3>

        <EventsList date={date || ''} showItemControls />
      </div>
    </Container>
  );
};

export default DayPage;
