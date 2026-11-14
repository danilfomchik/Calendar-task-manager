import DayNoteRow from '@/components/common/DayNote';

import {DayContextBlock} from '../types';

// The shared Day note input row (also used by the Agenda panel and Bottom sheet), so one module owns autosave
const DayNote: DayContextBlock = ({date}) => <DayNoteRow date={date} />;

export default DayNote;
