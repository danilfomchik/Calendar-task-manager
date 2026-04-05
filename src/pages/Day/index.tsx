import moment from 'moment';
import {useNavigate, useParams} from 'react-router';

import Button from '@/components/common/Button';
import EventsList from '@/components/common/EventsList';
import Container from '@/components/layout/Container';
import ArrowLeft from '@/components/ui/icons/ArrowLeft';
import {formatDate} from '@/services/dateUtils';

import AddEvent from '../Main/components/Header/Controls/AddEvent';
import AIInfo from './components/AIInfo';

// separate branches TODO
// add correct selectedDate handling (on refresh) - on separate branch

const DayPage = () => {
  const navigate = useNavigate();
  const {date} = useParams<{date: string}>();

  const handleReturn = () => {
    navigate(-1);
  };

  const isGroqEnabled = import.meta.env.VITE_REACT_APP_IS_GROQ_ENABLED === 'true';

  return (
    <>
      <header className="h-[77px] sticky top-0 z-50 px-6 py-5 bg-[#0a0a0a] border-b border-secondaryBackgroundColor">
        <div className="flex items-center justify-between gap-4 h-full">
          <div className="flex items-center gap-4 divide-x-[1px] divide-[#1e1e1e]">
            <Button
              text="Back"
              onClick={handleReturn}
              startIcon={<ArrowLeft size="size-4" />}
              className="w-fit p-0"
              variant="transparent"
            />

            <time dateTime={date} className="text-[17px] text-[#444444] pl-4">
              {formatDate(moment(date), 'dddd, MMMM Do')}
            </time>
          </div>

          <AddEvent date={date} className="max-md:w-fit px-4" />
        </div>
      </header>

      <Container className="flex w-full max-h-[calc(100vh-77px)] px-0 py-0 overflow-x-hidden">
        <div className="flex flex-col gap-4 flex-[0_0_230px] py-[22px] px-[18px] divide-y-[1px] divide-secondaryBackgroundColor border-r border-secondaryBackgroundColor">
          <time dateTime={date} className="flex flex-col gap-2 text-[76px]/[1] font-extralight text-white">
            {formatDate(moment(date), 'Do')}
            <span className="text-base text-[#444444] uppercase tracking-[0.08em]">
              {formatDate(moment(date), 'dddd')}
            </span>
          </time>

          {isGroqEnabled && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 pt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7] animate-pulse"></div>
                <p className="text-xs text-[#444444] uppercase">ai insights</p>
              </div>

              <AIInfo date={date} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8 flex-1 max-h-[calc(100vh-77px)] overflow-scroll px-4 py-5">
          <EventsList date={date || ''} showItemControls />
        </div>
      </Container>
    </>
  );
};

export default DayPage;
