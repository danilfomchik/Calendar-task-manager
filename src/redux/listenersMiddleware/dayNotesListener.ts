import {StorageKeys} from '@/types/types';

import {setDayNote} from '../dayNotes/dayNotesSlice';
import {startAppListening} from '../listenerMiddleware';

startAppListening({
  actionCreator: setDayNote,
  effect: (_, listenerApi) => {
    const {notesByDate} = listenerApi.getState().dayNotesData;

    localStorage.setItem(StorageKeys.dayNotes, JSON.stringify(notesByDate));
  },
});
