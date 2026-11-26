import {useEffect, useLayoutEffect, useRef, useState} from 'react';

import NoteIcon from '@/components/ui/icons/NoteIcon';
import {cx} from '@/services/utils';

import DayNoteText from './DayNoteText';
import RemoveButton from './RemoveButton';
import SavedMark from './SavedMark';
import {MAX_ROWS} from './constants';
import {TDayNoteEditorProps} from './types';
import {useDayNoteDraft} from './useDayNoteDraft';

// One plain-text note per date, written in place. A dashed "Add a note" line until used, then one row
// [icon] [text] [✓] [×] that saves itself (useDayNoteDraft). At rest the text is clamped to 2 lines (DayNoteText). An
// emptied or removed note goes back to the dashed line. Never counted as an event.
// Mount it keyed by date (DayNote does), so the draft belongs to one day.
const DayNoteEditor = ({date}: TDayNoteEditorProps) => {
  const {draft, isSaved, change, flush, remove, dropBlank} = useDayNoteDraft(date);

  const [isEditing, setIsEditing] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // where the textarea's caret goes when editing starts; null means the end of the text
  const caretRef = useRef<number | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  // set by removeNote(): focus "Add a note" once it replaces the row
  const shouldFocusAdd = useRef(false);

  const hasNote = !!draft.trim();

  // Grow with the text; the line height comes from the stylesheet, so the limit follows the font size
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const maxHeight = parseFloat(getComputedStyle(textarea).lineHeight) * MAX_ROWS;

    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [draft, isEditing, hasNote]);

  // Editing starts with the caret where the text was clicked (or at the end), not at the very start
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!isEditing || !textarea) return;

    const caret = Math.min(caretRef.current ?? textarea.value.length, textarea.value.length);
    textarea.setSelectionRange(caret, caret);
  }, [isEditing]);

  // The pressed button goes with the row, so focus is moved to "Add a note" in its place instead of dropping to <body>
  const removeNote = () => {
    remove();
    setIsEditing(false);
    setShouldFocus(false);
    shouldFocusAdd.current = true;
  };

  const onBlur = () => {
    flush();
    setIsEditing(false);
    setShouldFocus(false);
    dropBlank();
  };

  const startEditing = (caret: number | null = null) => {
    caretRef.current = caret;
    setIsEditing(true);
    setShouldFocus(true);
  };

  const isEmptyLine = !isEditing && !hasNote;

  useEffect(() => {
    if (!isEmptyLine || !shouldFocusAdd.current) return;

    shouldFocusAdd.current = false;
    addButtonRef.current?.focus();
  }, [isEmptyLine]);

  if (isEmptyLine) {
    return (
      <button
        ref={addButtonRef}
        type="button"
        onClick={() => startEditing()}
        className="group flex w-full cursor-pointer items-center gap-2.5 border-l-2 border-dashed border-line-strong py-1 pl-3 text-left text-para-s text-text-faint transition-colors hover:border-text-faint hover:text-text-muted focus-visible:bg-surface-raised focus-visible:text-text-muted focus-visible:outline-offset-0!">
        <NoteIcon className="size-4 shrink-0" />
        Add a note
      </button>
    );
  }

  // One row element for both states, with the saved check and the remove button as stable siblings of the swapped
  // middle: tabbing from the textarea to × (which blurs it and switches the row to its at-rest form) keeps the
  // focused button mounted. The editing look follows isEditing, not focus-within, so focusing Show more or × at rest
  // does not make the row look edited.
  return (
    <div
      // keeps focus in the textarea when the row's padding, icon or check is pressed while editing
      onMouseDown={e => {
        if (isEditing && e.target !== textareaRef.current) e.preventDefault();
      }}
      className={cx(
        // top-aligned so the icon and the saved check stay on the first line as the note grows; the left rule is the
        // only frame, and a tight 4px block padding keeps the written note compact
        'group flex items-start gap-2.5 border-l-2 py-1 pr-2 pl-3 transition-colors',
        isEditing ? 'cursor-text border-action bg-surface-raised' : 'border-line-strong hover:border-text-faint',
      )}>
      <NoteIcon
        className={cx('mt-0.5 size-4 shrink-0 transition-colors', isEditing ? 'text-action' : 'text-text-faint')}
      />
      {isEditing ? (
        <textarea
          ref={textareaRef}
          autoFocus={shouldFocus}
          rows={1}
          value={draft}
          aria-label="Day note"
          placeholder="Add a note"
          onChange={e => change(e.target.value)}
          onBlur={onBlur}
          // the row's border shows focus instead of the global outline
          className="min-w-0 flex-1 resize-none bg-transparent text-para-m md:text-para-s text-text placeholder:text-text-faint focus-visible:outline-none!"
        />
      ) : (
        <DayNoteText text={draft} onEdit={startEditing} />
      )}
      <SavedMark isSaved={isSaved} />
      {/* Not offered for a still-empty note (tabbing to it would blur the textarea and collapse the row under it), but
      its slot is always kept, so the first character typed does not narrow the textarea */}
      <RemoveButton onClick={removeNote} isAvailable={hasNote} />
    </div>
  );
};

export default DayNoteEditor;
