import {useEffect, useId, useLayoutEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import NoteIcon from '@/components/ui/icons/NoteIcon';
import {setDayNote} from '@/redux/dayNotes/dayNotesSlice';
import {selectDayNote} from '@/redux/dayNotes/selectors';
import {useAppDispatch} from '@/redux/store';
import {cx} from '@/services/utils';

import {TDayNoteEditorProps} from './types';

const AUTOSAVE_DELAY_MS = 600;
const SAVED_VISIBLE_MS = 1500;
// the textarea grows with its text from 1 line up to 6, then scrolls
const MAX_ROWS = 6;

// One plain-text note per date, written in place. A dashed "Add a note" line until used, then one input row
// [icon] [text] [Saved] that saves itself shortly after typing stops (and on blur and unmount). An emptied note
// is removed and the row goes back to the dashed line. Never counted as an event.
// Mount it keyed by date (DayNote does), so the draft belongs to one day.
const DayNoteEditor = ({date, variant = 'row'}: TDayNoteEditorProps) => {
  const dispatch = useAppDispatch();
  const textareaId = useId();
  const storedNote = useSelector(selectDayNote(date)) ?? '';

  const [draft, setDraft] = useState(storedNote);
  const [isEditing, setIsEditing] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimer = useRef<number>();
  const savedTimer = useRef<number>();

  // Latest values for the timers and the unmount save (e.g. the panel switches date or unmounts mid-edit)
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
    if (!commit()) return;

    setIsSaved(true);
    window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setIsSaved(false), SAVED_VISIBLE_MS);
  };

  useEffect(
    () => () => {
      window.clearTimeout(savedTimer.current);
      commit();
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const hasNote = !!draft.trim();
  const isCollapsed = variant === 'compact' && !isEditing;

  // Grow with the text; the line height comes from the stylesheet, so the limit follows the font size
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const maxHeight = parseFloat(getComputedStyle(textarea).lineHeight) * (isCollapsed ? 1 : MAX_ROWS);

    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [draft, isEditing, hasNote, isCollapsed]);

  const onChange = (text: string) => {
    setDraft(text);
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
        className="flex min-h-11 w-full cursor-pointer items-center gap-2 border border-dashed border-line px-3 text-left font-mono text-[11px] tracking-widest text-text-faint uppercase transition-colors hover:border-line-strong hover:text-text-muted focus-visible:border-action focus-visible:text-text-muted focus-visible:outline-none!">
        <span aria-hidden>+</span> Add a note
      </button>
    );
  }

  return (
    <label
      htmlFor={textareaId}
      className={cx(
        'group flex cursor-text items-start gap-2.5 border border-line bg-surface-sunken px-3 py-2.5 transition-colors hover:border-line-strong',
        'focus-within:border-action focus-within:bg-surface-raised focus-within:shadow-[0_0_0_1px_var(--color-action)]',
      )}>
      <NoteIcon className="mt-0.5 size-4 shrink-0 text-text-faint transition-colors group-focus-within:text-action" />
      <textarea
        ref={textareaRef}
        id={textareaId}
        autoFocus={shouldFocus}
        rows={1}
        value={draft}
        aria-label="Day note"
        placeholder="Add a note"
        onChange={e => onChange(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={onBlur}
        className={cx(
          // the row's border shows focus instead of the global outline
          'min-w-0 flex-1 resize-none bg-transparent text-sm leading-5 text-text placeholder:text-text-faint focus-visible:outline-none!',
          isCollapsed && 'overflow-hidden',
        )}
      />
      <span role="status" className="font-mono text-[10px] leading-5 text-text-faint">
        {isSaved ? 'Saved' : ''}
      </span>
    </label>
  );
};

export default DayNoteEditor;
