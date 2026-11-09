import moment from 'moment';
import {memo, useRef} from 'react';
import {useSelector} from 'react-redux';
import {useSearchParams} from 'react-router';

import Button from '@/components/common/Button';
import DottedEventsList from '@/components/common/DottedEventsList';
import AddIcon from '@/components/ui/icons/AddIcon';
import ExternalPage from '@/components/ui/icons/ExternalPage';
import {useEventsList} from '@/hooks/useEventsList';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {setSelectedDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectSelectedDate} from '@/redux/date/selectors';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {CURRENT_DATE_PARAMS_KEY, EVENT_FORM_ID} from '@/services/constants';
import {formatDate, getDate} from '@/services/dateUtils';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';

import {useAgendaPanel} from '../../../AgendaPanelContext';
import DayEventsList from './DayEventsList';
import {TDayProps} from './types';

const Day = ({date}: TDayProps) => {
  const [, setSearchParams] = useSearchParams();

  const dispatch = useAppDispatch();
  const {openFor} = useAgendaPanel();

  const isMobileScreen = useMediaQuery({size: 'sm', direction: 'to'});

  const dayRef = useRef<HTMLDivElement>(null);

  const events = useEventsList(date) || [];
  const selectedDate = useSelector(selectSelectedDate);
  const fullDate = useSelector(selectFullDate);
  const currentMonth = formatDate(moment(fullDate), 'M');
  const dateMonth = formatDate(moment(date), 'M');

  const currentDate = formatDate(getDate(new Date()), 'YYYY-MM-DD');
  const day = formatDate(getDate(date), 'DD');

  const handleDayClick = () => {
    if (!isMobileScreen) {
      openFor(date);

      return;
    }

    const isCurrentDate = date === fullDate;

    dispatch(setSelectedDate(isCurrentDate ? currentDate : date));
    setSearchParams(isCurrentDate ? '' : `?${CURRENT_DATE_PARAMS_KEY}=${date}`);
  };

  const handleOpen = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.create, date}));
  };

  return (
    <div
      tabIndex={isMobileScreen ? -1 : 0}
      role="button"
      ref={dayRef}
      onClick={handleDayClick}
      onKeyDown={e => {
        // only the cell itself; inner buttons handle their own keys
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleDayClick();
        }
      }}
      className={cx(
        'group flex flex-col gap-1 relative min-h-0 not-nth-[7n]:border-r border-b border-line p-1 md:p-1.5 transition-colors cursor-default',
        {
          'bg-surface-sunken md:hover:bg-surface-raised': dateMonth !== currentMonth,
          'md:hover:bg-surface-raised': dateMonth === currentMonth,
          'md:z-10 md:outline-2 md:-outline-offset-2 md:outline-action': date === selectedDate && !isMobileScreen,
        },
        'max-md:bg-transparent max-md:border-none max-md:items-center',
      )}>
      <div className="flex items-center justify-between h-7 shrink-0">
        <div className="flex items-center gap-1.5">
          <span
            className={cx(
              'font-display font-extrabold tracking-tight text-[22px] leading-none px-1 min-w-7 h-7 flex items-center justify-center text-text border border-transparent transition-colors',
              {
                'border-action': date === selectedDate && isMobileScreen && currentDate !== date,
                'text-text-faint': dateMonth !== currentMonth,
                'bg-info border-none text-info-ink': currentDate === date,
              },
            )}>
            <time dateTime={date}>{day}</time>
          </span>

          {events.length > 0 && !isMobileScreen && (
            <span className="font-mono border border-line-strong px-1 text-[10px] leading-4 text-text-muted">
              {events.length}
            </span>
          )}
        </div>

        <div className="flex items-center max-md:hidden opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <Button
            title="Open day page"
            kind="link"
            to={`/day/${date}`}
            className="p-0 bg-transparent border-none text-text-muted hover:text-text"
            startIcon={<ExternalPage size="size-5" />}
          />
          <Button
            title="Create event"
            className="p-0 bg-transparent border-none text-action hover:text-action hover:brightness-125"
            startIcon={<AddIcon size="size-5" />}
            onClick={e => {
              e.stopPropagation();
              handleOpen();
            }}
          />
        </div>
      </div>

      {isMobileScreen ? <DottedEventsList events={events} /> : <DayEventsList date={date} events={events} />}
    </div>
  );
};

export default memo(Day);
