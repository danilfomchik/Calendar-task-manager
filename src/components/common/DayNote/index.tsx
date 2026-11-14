import DayNoteEditor from './DayNoteEditor';
import {TDayNoteProps} from './types';

// Keyed by date so a draft never leaks into another day
const DayNote = (props: TDayNoteProps) => <DayNoteEditor key={props.date} {...props} />;

export default DayNote;
