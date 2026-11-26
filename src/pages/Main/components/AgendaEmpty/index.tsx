import moment from 'moment';
import {useSelector} from 'react-redux';

import {selectHasAnyEvents} from '@/redux/events/selectors';

import AfterThat from './AfterThat';
import FirstRun from './FirstRun';
import NextEventLink from './NextEventLink';
import {TAgendaEmptyProps} from './types';
import {useNextEvent} from './useNextEvent';

// The Agenda panel / Bottom sheet body for a day with no events. The header above already reads "Free day", so the
// body never repeats it: on first run (no events anywhere) it is the one first-run state (FirstRun); otherwise it
// leads with the Next event and the days after it, so an empty day (often today, the landing day) reads as what is
// coming rather than a blank column.
const AgendaEmpty = ({date, placement}: TAgendaEmptyProps) => {
  const hasAnyEvents = useSelector(selectHasAnyEvents);
  const nextEvent = useNextEvent(date);

  if (!hasAnyEvents) return <FirstRun date={date} placement={placement} />;

  if (!nextEvent) {
    return <p className="text-para-s text-text-muted">Nothing planned after {moment(date).format('D MMMM')}.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <NextEventLink event={nextEvent} />
      <AfterThat after={nextEvent.date} />
    </div>
  );
};

export default AgendaEmpty;
