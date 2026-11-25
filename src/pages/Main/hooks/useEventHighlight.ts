import {useCallback, useEffect, useRef, useState} from 'react';

const HIGHLIGHT_MS = 1600;

// The event whose Agenda panel row is briefly highlighted after a grid chip's click, cleared after HIGHLIGHT_MS. A new
// highlight restarts the timer.
export const useEventHighlight = () => {
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const highlight = useCallback((eventId: string) => {
    setHighlightedEventId(eventId);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setHighlightedEventId(null), HIGHLIGHT_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return {highlightedEventId, highlight};
};
