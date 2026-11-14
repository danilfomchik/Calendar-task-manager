import DayNote from '@/components/common/DayNote';

import {DayContextBlock} from '../types';

// The shared Day note input row (also used by the Agenda panel and Bottom sheet), so one module owns autosave
const DayNoteBlock: DayContextBlock = ({date}) => <DayNote date={date} />;

export default DayNoteBlock;
