import Tooltip from '@/components/Tooltip';

import {TEventProps} from './types';

const Event = ({event, eventRef}: TEventProps) => {
    return (
        <Tooltip
            triggerElement={
                <div
                    ref={eventRef}
                    className="h-[8px] w-[8px] flex-none rounded-full"
                    style={{backgroundColor: event.color}}></div>
            }
            className="w-auto h-auto"
            contentClassName="whitespace-nowrap text-ellipsis overflow-hidden">
            {event.title}
        </Tooltip>
    );
};

export default Event;
