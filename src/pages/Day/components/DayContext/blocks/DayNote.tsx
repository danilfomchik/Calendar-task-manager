import {useEffect, useId, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import {setDayNote} from '@/redux/dayNotes/dayNotesSlice';
import {selectDayNote} from '@/redux/dayNotes/selectors';
import {useAppDispatch} from '@/redux/store';

import {DayContextBlock, DayContextBlockProps} from './types';

// One plain-text note per date. Collapsed to a dashed "Add a note" line until used,
// saved on blur, and removed when emptied. Never counted as an event.
const DayNoteEditor = ({date}: DayContextBlockProps) => {
  const dispatch = useAppDispatch();
  const textareaId = useId();
  const storedNote = useSelector(selectDayNote(date)) ?? '';

  const [draft, setDraft] = useState(storedNote);
  const [isEditing, setIsEditing] = useState(false);

  // Latest values for the unmount save (e.g. the drawer swaps for the Bottom sheet mid-edit)
  const latest = useRef({draft, storedNote});
  latest.current = {draft, storedNote};

  const save = () => {
    const {draft: text, storedNote: saved} = latest.current;

    if (text !== saved) dispatch(setDayNote({date, text}));
  };

  useEffect(() => save, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onBlur = () => {
    save();
    setIsEditing(false);
    if (!draft.trim()) setDraft('');
  };

  if (!isEditing && !draft.trim()) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="flex min-h-11 w-full cursor-pointer items-center gap-2 border border-dashed border-line px-3 text-left font-mono text-[11px] tracking-widest text-text-faint uppercase transition-colors hover:border-line-strong hover:text-text-muted">
        <span aria-hidden>+</span> Add a note
      </button>
    );
  }

  return (
    <section aria-label="Day note" className="flex flex-col gap-2 border border-line bg-surface-raised p-3">
      <label htmlFor={textareaId} className="font-mono text-[10px] tracking-widest text-text-faint uppercase">
        Day note
      </label>
      <textarea
        id={textareaId}
        autoFocus={isEditing}
        rows={3}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={onBlur}
        placeholder="Add a note for this day"
        className="w-full resize-y bg-transparent text-sm leading-relaxed placeholder:text-text-faint"
      />
    </section>
  );
};

// Keyed by date so a draft never leaks into another day
const DayNote: DayContextBlock = ({date}) => <DayNoteEditor key={date} date={date} />;

export default DayNote;
