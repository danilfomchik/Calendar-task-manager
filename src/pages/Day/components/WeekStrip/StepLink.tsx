import moment from 'moment';
import {Link} from 'react-router';

import {cx} from '@/services/utils';

import {getDayPath} from '../../helpers';

// Chevron at either end of the Week strip: one day back or forward, across week and month boundaries
const StepLink = ({side, date}: {side: 'prev' | 'next'; date: string}) => {
  const isPrev = side === 'prev';
  const label = `${isPrev ? 'Previous' : 'Next'} day, ${moment(date).format('dddd D MMMM')}`;

  return (
    <Link
      to={getDayPath(date)}
      aria-label={label}
      title={label}
      className={cx(
        'hidden w-11 shrink-0 items-center justify-center text-text-muted transition-colors hover:bg-info/10 hover:text-info focus-visible:-outline-offset-2 md:flex',
        isPrev ? 'border-r border-line' : 'border-l border-line',
      )}>
      <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.25}>
        <path d={isPrev ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="square" />
      </svg>
    </Link>
  );
};

export default StepLink;
