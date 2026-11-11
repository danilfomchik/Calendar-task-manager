import moment from 'moment';
import {useNavigate} from 'react-router';

import {setFullDate, setSelectedDate} from '@/redux/date/dateSlice';
import {useAppDispatch} from '@/redux/store';
import {RouterPaths} from '@/types/types';

import {CONTROL_CLASS} from './constants';

// Back to the Month grid showing the Viewed day's month, with the Viewed day selected. Not navigate(-1): after stepping between
// days that would land on the previous day, and on a direct load it would leave the app.
const BackToMonth = ({date}: {date: string}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const monthLabel = moment(date).format('MMMM YYYY');

  const handleClick = () => {
    dispatch(setFullDate(date));
    dispatch(setSelectedDate(date));
    navigate(RouterPaths.home);
  };

  return (
    <button type="button" onClick={handleClick} aria-label={`Back to ${monthLabel}`} className={CONTROL_CLASS}>
      <span aria-hidden>‹</span> {monthLabel}
    </button>
  );
};

export default BackToMonth;
