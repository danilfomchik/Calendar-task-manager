import {useCallback, useSyncExternalStore} from 'react';

// Whether a CSS media query matches, followed live; false on the server. useMediaQuery builds the Tailwind breakpoint
// queries on it.
export const useMatchMedia = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);

      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
