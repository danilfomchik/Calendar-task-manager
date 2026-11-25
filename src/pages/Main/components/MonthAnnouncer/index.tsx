import moment from 'moment';
import {useState} from 'react';
import {useSelector} from 'react-redux';

import {selectFullDate} from '@/redux/date/selectors';

// Polite status region that names the Visible month ("December 2026") whenever it changes after the page has mounted:
// the header arrows, ← / →, Month swipe, Today, the month picker and the sidebar mini-calendar all land here. Empty on
// first render, so arriving on Home announces nothing extra. Mounted with the page, so the region exists before its
// first change.
const MonthAnnouncer = () => {
  const month = moment(useSelector(selectFullDate)).format('MMMM YYYY');
  const [announced, setAnnounced] = useState({month, text: ''});

  // derived during render rather than in an effect: the text changes in the same commit as the month
  if (announced.month !== month) setAnnounced({month, text: month});

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {announced.text}
    </div>
  );
};

export default MonthAnnouncer;
