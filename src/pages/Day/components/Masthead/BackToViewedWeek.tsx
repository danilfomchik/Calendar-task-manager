import moment from 'moment';

import {HAIRLINE_CONTROL_CLASS} from '@/services/styles';
import {cx} from '@/services/utils';

// Shown after swiping the Week strip away from the Viewed day's week; one tap returns to it
const BackToViewedWeek = ({date, onClick, className}: {date: string; onClick: () => void; className?: string}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Back to ${moment(date).format('dddd D MMMM')}`}
    className={cx(HAIRLINE_CONTROL_CLASS, 'shrink-0 whitespace-nowrap', className)}>
    Back to {moment(date).format('D')} <span className="md:hidden">{moment(date).format('MMM')}</span>
    <span className="max-md:hidden">{moment(date).format('MMMM')}</span>
  </button>
);

export default BackToViewedWeek;
