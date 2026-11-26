import {calendarColorStyle} from '@/services/styles';
import {cx} from '@/services/utils';

import {TEventProps} from './types';

// decorative marker: the day cell is the tap target. A filtered-out calendar is a hollow dot (shape, not only colour)
const DottedEventsListItem = ({color, isDisabled}: TEventProps) => (
  <span
    aria-hidden
    className={cx('block size-1.5 shrink-0 rounded-full border border-(--calendar-color)', {
      'bg-(--calendar-color)': !isDisabled,
      'bg-transparent': isDisabled,
    })}
    style={calendarColorStyle(color)}
  />
);

export default DottedEventsListItem;
