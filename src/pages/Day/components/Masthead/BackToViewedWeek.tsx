import moment from 'moment';

import {HAIRLINE_CONTROL_CLASS} from '@/services/styles';
import {cx} from '@/services/utils';

// Mobile: shown after swiping the Week strip away from the Viewed day's week; one tap returns to it
const BackToViewedWeek = ({date, onClick}: {date: string; onClick: () => void}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Back to ${moment(date).format('dddd D MMMM')}`}
    className={cx(HAIRLINE_CONTROL_CLASS, 'shrink-0 whitespace-nowrap')}>
    Back to {moment(date).format('D')}
  </button>
);

export default BackToViewedWeek;
