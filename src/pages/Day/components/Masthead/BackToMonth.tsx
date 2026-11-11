import moment from 'moment';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router';

import {setFullDate, setSelectedDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectHasShownMonthGrid} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {HAIRLINE_CONTROL_CLASS} from '@/services/styles';
import {RouterPaths} from '@/types/types';

// Back to the Month grid the user came from. The Day page never writes the date slice, so when Home was shown
// earlier in this session the slice still holds Home's month and selection: go back to them untouched.
// On a direct load (or reload) of a Day URL there is no such month, so show the Viewed day's month with the
// Viewed day selected. Not navigate(-1): after stepping between days that would land on the previous day,
// and on a direct load it would leave the app.
const BackToMonth = ({date}: {date: string}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasShownMonthGrid = useSelector(selectHasShownMonthGrid);
  const homeMonth = useSelector(selectFullDate);
  const monthLabel = moment(hasShownMonthGrid ? homeMonth : date).format('MMMM YYYY');

  const handleClick = () => {
    if (!hasShownMonthGrid) {
      dispatch(setFullDate(date));
      dispatch(setSelectedDate(date));
    }

    navigate(RouterPaths.home);
  };

  return (
    <button type="button" onClick={handleClick} aria-label={`Back to ${monthLabel}`} className={HAIRLINE_CONTROL_CLASS}>
      <span aria-hidden>‹</span> {monthLabel}
    </button>
  );
};

export default BackToMonth;
