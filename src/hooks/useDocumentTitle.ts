import {useEffect} from 'react';

import {APP_TITLE} from '@/services/constants';

// Sets the tab title to "<title> · Calendar" (the bare app name when title is empty), so tabs and history tell pages
// and months apart. Restores the app name on unmount; the next page's own title then replaces it.
export const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_TITLE}` : APP_TITLE;
  }, [title]);

  useEffect(
    () => () => {
      document.title = APP_TITLE;
    },
    [],
  );
};
