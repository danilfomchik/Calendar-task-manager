import classNames from 'classnames';
import {memo} from 'react';

import EventForm from '@/components/common/EventForm';
import {FormActionType} from '@/components/common/EventForm/types';
import Modal from '@/components/common/Modal';
import Tooltip from '@/components/ui/Tooltip';
import {useEventTooltip} from '@/hooks/useEventTooltip';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import {useOpeningItem} from '@/hooks/useOpeningItem';
import {getCalendarColor} from '@/services/calendars';
import {cx} from '@/services/utils';

import {TEventProps} from './types';

const Event = ({event, isDisabled, eventRef}: TEventProps) => {
  const {ref, isOpen, handleClose, handleOpen} = useOpeningItem();
  const isMobileScreen = useMediaQuery({size: 'md', direction: 'to'});
  const {isFitsContainer, onTooltipHover} = useEventTooltip();

  const calendarColor = getCalendarColor(event.eventCalendar);

  return (
    <>
      <Tooltip
        disabled={isMobileScreen}
        triggerElement={
          <div
            ref={eventRef}
            className={cx('h-[8px] w-[8px] rounded-full transition-opacity', {
              'opacity-10 pointer-events-none cursor-not-allowed': isDisabled,
            })}
            style={{background: calendarColor}}
            onClick={() => {
              if (isMobileScreen) return;

              handleOpen();
            }}></div>
        }
        className="w-auto h-auto"
        contentClassName={classNames('whitespace-nowrap text-ellipsis overflow-hidden', {
          'right-[1px]': !isFitsContainer,
          'left-0': isFitsContainer,
        })}
        onHover={onTooltipHover}>
        {event.title}
      </Tooltip>

      {isOpen && (
        <Modal refItem={ref} onClose={handleClose}>
          <EventForm
            actionType={FormActionType.edit}
            formTitle="Edit event form"
            event={event}
            handleModalClose={handleClose}
          />
        </Modal>
      )}
    </>
  );
};

export default memo(Event);
