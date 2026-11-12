import {useEffect, useId, useLayoutEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import {setDayNote} from '@/redux/dayNotes/dayNotesSlice';
import {selectDayNote} from '@/redux/dayNotes/selectors';
import {useAppDispatch} from '@/redux/store';
import {cx} from '@/services/utils';

import {DayContextBlock, DayContextBlockProps} from '../types';

const AUTOSAVE_DELAY_MS = 600;
const SAVED_VISIBLE_MS = 2000;
// the textarea grows with its text from 3 lines up to 10, then scrolls
const MAX_ROWS = 10;

type TSaveStatus = 'idle' | 'saving' | 'saved';

const STATUS_TEXT: Record<TSaveStatus, string> = {idle: '', saving: 'Saving…', saved: 'Saved'};

// One plain-text note per date. A dashed "Add a note" line until used, then one always-editable card that saves
// itself shortly after typing stops (and on blur and unmount). An emptied note is removed and the card goes
// back to the dashed line. Never counted as an event.
const DayNoteEditor = ({date}: DayContextBlockProps) => {
  const dispatch = useAppDispatch();
  const textareaId = useId();
  const storedNote = useSelector(selectDayNote(date)) ?? '';

  const [draft, setDraft] = useState(storedNote);
  const [isEditing, setIsEditing] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);
  const [status, setStatus] = useState<TSaveStatus>('idle');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimer = useRef<number>();
  const savedTimer = useRef<number>();

  // Latest values for the timers and the unmount save (e.g. the drawer swaps for the Bottom sheet mid-edit)
  const latest = useRef({draft, storedNote});
  latest.current = {draft, storedNote};

  // Dispatches when the draft differs from what is stored; returns whether it did
  const commit = () => {
    window.clearTimeout(saveTimer.current);

    const {draft: text, storedNote: saved} = latest.current;

    if (text === saved) return false;

    dispatch(setDayNote({date, text}));

    return true;
  };

  const flush = () => {
    if (commit()) {
      setStatus('saved');
      window.clearTimeout(savedTimer.current);
      savedTimer.current = window.setTimeout(() => setStatus('idle'), SAVED_VISIBLE_MS);
    } else {
      setStatus(current => (current === 'saving' ? 'idle' : current));
    }
  };

  useEffect(
    () => () => {
      window.clearTimeout(savedTimer.current);
      commit();
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const hasNote = !!draft.trim();

  // Grow with the text; the line height comes from the stylesheet, so the limit follows the font size
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const maxHeight = parseFloat(getComputedStyle(textarea).lineHeight) * MAX_ROWS;

    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [draft, isEditing, hasNote]);

  const onChange = (text: string) => {
    setDraft(text);
    setStatus('saving');
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(flush, AUTOSAVE_DELAY_MS);
  };

  const onBlur = () => {
    flush();
    setIsEditing(false);
    setShouldFocus(false);
    if (!draft.trim()) setDraft('');
  };

  if (!isEditing && !hasNote) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsEditing(true);
          setShouldFocus(true);
        }}
        className="flex min-h-11 w-full cursor-pointer items-center gap-2 border border-dashed border-line px-3 text-left font-mono text-[11px] tracking-widest text-text-faint uppercase transition-colors hover:border-line-strong hover:text-text-muted">
        <span aria-hidden>+</span> Add a note
      </button>
    );
  }

  return (
    <section
      aria-label="Day note"
      className={cx(
        'flex flex-col gap-2 border border-l-2 border-line border-l-line-strong bg-surface-raised p-3 transition-colors',
        'focus-within:border-line-strong focus-within:border-l-action',
      )}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={textareaId} className="font-mono text-[10px] tracking-widest text-text-faint uppercase">
          Day note
        </label>
        <span role="status" className="font-mono text-[10px] tracking-wider text-text-faint uppercase">
          {STATUS_TEXT[status]}
        </span>
      </div>
      <textarea
        ref={textareaRef}
        id={textareaId}
        autoFocus={shouldFocus}
        rows={3}
        value={draft}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={onBlur}
        placeholder="Add a note for this day"
        className="w-full resize-none bg-transparent text-sm leading-relaxed placeholder:text-text-faint"
      />
    </section>
  );
};

// Keyed by date so a draft never leaks into another day
const DayNote: DayContextBlock = ({date}) => <DayNoteEditor key={date} date={date} />;

export default DayNote;
