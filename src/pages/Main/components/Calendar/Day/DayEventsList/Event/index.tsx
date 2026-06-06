import classNames from 'classnames';
import {memo} from 'react';

import Tooltip from '@/components/ui/Tooltip';
import {useEventTooltip} from '@/hooks/useEventTooltip';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {setEventFormData} from '@/redux/events/eventsSlice';
import {onOpenItem} from '@/redux/overflow/overflowSlice';
import {useAppDispatch} from '@/redux/store';
import {getCalendarColor} from '@/services/calendars';
import {EVENT_FORM_ID} from '@/services/constants';
import {cx} from '@/services/utils';
import {FormActionType} from '@/types/eventFormTypes';

import {TEventProps} from './types';

const Event = ({event, isDisabled, eventRef}: TEventProps) => {
  const isMobileScreen = useMediaQuery({size: 'md', direction: 'to'});
  const {isFitsContainer, onTooltipHover} = useEventTooltip();

  const calendarColor = getCalendarColor(event.eventCalendar);

  const dispatch = useAppDispatch();

  const handleOpen = () => {
    dispatch(onOpenItem(EVENT_FORM_ID));
    dispatch(setEventFormData({actionType: FormActionType.edit, event}));
  };

  return (
    <Tooltip
      disabled={isMobileScreen}
      triggerElement={
        <button
          ref={eventRef}
          className={cx('h-1.5 md:h-[8px] w-1.5 md:w-[8px] rounded-full transition-opacity', {
            'opacity-10 pointer-events-none cursor-not-allowed': isDisabled,
          })}
          style={{background: calendarColor}}
          onClick={() => {
            if (isMobileScreen) return;

            handleOpen();
          }}></button>
      }
      className="w-auto h-auto"
      contentClassName={classNames('whitespace-nowrap text-ellipsis overflow-hidden', {
        'right-[1px]': !isFitsContainer,
        'left-0': isFitsContainer,
      })}
      onHover={onTooltipHover}>
      {event.title}
    </Tooltip>
  );
};

export default memo(Event);
