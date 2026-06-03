import moment from 'moment';
import {useNavigate, useParams} from 'react-router';

import Button from '@/components/common/Button';
import EventsList from '@/components/common/EventsList';
import ArrowLeft from '@/components/ui/icons/ArrowLeft';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {formatDate} from '@/services/dateUtils';

import AddEvent from '../Main/components/Header/Controls/AddEvent';
import AIInfo from './components/AIInfo';

// separate branches TODO
// replace momentjs with date-fns or dayjs
// add correct selectedDate handling (on refresh) - on separate branch
// d&d for events list

const DayPage = () => {
  const navigate = useNavigate();
  const {date} = useParams<{date: string}>();
  const showEventsCount = useMediaQuery({size: 'sm', direction: 'to'});

  const handleReturn = () => {
    navigate(-1);
  };

  const isGroqEnabled = import.meta.env.VITE_REACT_APP_IS_GROQ_ENABLED === 'true';

  return (
    <>
      <header className="h-header-height sticky top-0 z-50 px-3 md:px-5 py-4 md:py-5 bg-[#0a0a0a] md:border-b border-secondary-background-color">
        <div className="flex items-center justify-between gap-4 h-full">
          <div className="flex items-center gap-4 md:divide-x-[1px] divide-[#1e1e1e]">
            <Button
              text="Back"
              onClick={handleReturn}
              startIcon={<ArrowLeft size="size-4" />}
              className="w-fit p-0 hidden md:flex"
              variant="transparent"
            />

            <Button
              text={formatDate(moment(date), 'MMMM YYYY')}
              onClick={handleReturn}
              startIcon={<ArrowLeft size="size-4" />}
              className="w-fit p-0 max-md:flex hidden"
              variant="transparent"
            />

            <time dateTime={date} className="max-md:hidden text-base md:text-[17px]/[1] text-[#444444] md:pl-4">
              {formatDate(moment(date), 'MMMM YYYY')}
            </time>
          </div>

          <AddEvent date={date} className="max-md:hidden" />
        </div>
      </header>

      <div className="flex max-md:flex-col w-full h-[calc(100vh-var(--header-height))] h-[calc(100svh-var(--header-height))] px-0 py-0 overflow-x-hidden">
        <div className="flex flex-col gap-4 md:flex-[0_0_230px] py-4 md:py-[22px] px-[18px] border-r border-secondary-background-color">
          <time dateTime={date} className="flex md:flex-col max-md:items-center justify-between gap-2">
            <div className="max-md:flex items-center justify-center max-md:bg-blue-600 max-md:w-20 max-md:h-20 rounded-full">
              <span className="text-white font-normal text-6xl/[1] md:text-[76px]/[1]">
                {formatDate(moment(date), 'Do')}
              </span>
            </div>
            {/* desktop weekday */}
            <span className="hidden md:block text-base text-[#444444] uppercase tracking-[0.08em] font-extralight">
              {formatDate(moment(date), 'dddd')}
            </span>
            {/* mobile weekday */}
            <div className="hidden max-md:flex flex-col items-end">
              <p className="text-xl font-normal">{formatDate(moment(date), 'dddd')}</p>
              <div className="flex items-center gap-1 text-sm text-[#444444]">
                <span className="uppercase">{formatDate(moment(date), 'MMMM')}</span>·
                <span>{formatDate(moment(date), 'YYYY')}</span>
              </div>
            </div>
          </time>

          {isGroqEnabled && <AIInfo date={date} className="max-md:hidden" />}
        </div>

        <div className="flex flex-col flex-1 overflow-auto px-4 py-2 md:py-5">
          <EventsList date={date || ''} showItemControls showEventsCount={showEventsCount} />
        </div>

        <div className="flex-col gap-8 overflow-auto px-4 pb-5 hidden max-md:flex max-h-[250px]">
          {isGroqEnabled && <AIInfo date={date} />}
        </div>

        <AddEvent
          date={date}
          className="hidden max-md:flex self-center max-md:w-[min(50%,250px)] rounded-[100px] h-11 py-3 px-9 mb-5"
        />
      </div>
    </>
  );
};

export default DayPage;
