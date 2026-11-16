import {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';

import {setDayNote} from '@/redux/dayNotes/dayNotesSlice';
import {selectDayNote} from '@/redux/dayNotes/selectors';
import {useAppDispatch} from '@/redux/store';

const AUTOSAVE_DELAY_MS = 600;
const SAVED_VISIBLE_MS = 1500;

// The Day note's draft and its autosave: saved shortly after typing stops, on flush (blur) and on unmount (e.g. the
// panel switches date or unmounts mid-edit). `isSaved` is true for a moment after each save, for the check.
// An emptied note is deleted by the slice.
export const useDayNoteDraft = (date: string) => {
  const dispatch = useAppDispatch();
  const storedNote = useSelector(selectDayNote(date)) ?? '';

  const [draft, setDraft] = useState(storedNote);
  const [isSaved, setIsSaved] = useState(false);

  const saveTimer = useRef<number>();
  const savedTimer = useRef<number>();

  // Latest values for the timers and the unmount save
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

  const change = (text: string) => {
    setDraft(text);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(flush, AUTOSAVE_DELAY_MS);
  };

  // Deletes the note at once, without the saved check
  const remove = () => {
    window.clearTimeout(savedTimer.current);
    latest.current = {...latest.current, draft: ''};
    commit();
    setDraft('');
    setIsSaved(false);
  };

  // A whitespace-only draft becomes empty, so the row goes back to the dashed line
  const dropBlank = () => {
    if (!latest.current.draft.trim()) setDraft('');
  };

  return {draft, isSaved, change, flush, remove, dropBlank};
};
