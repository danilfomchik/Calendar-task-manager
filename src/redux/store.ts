import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';

import {conditionsApi} from './conditions/conditionsApi';
import dateSlice from './date/dateSlice';
import {holidaysApi} from './dateHolidaysGenerator/holidaysApi';
import dayNotesSlice from './dayNotes/dayNotesSlice';
import eventsSlice from './events/eventsSlice';
import {listenerMiddleware} from './listenerMiddleware';
import './listenersMiddleware';
import locationSlice from './location/locationSlice';
import myCalendarsSlice from './myCalendars/myCalendarsSlice';
import overflowSlice from './overflow/overflowSlice';
import sidebarSlice from './sidebar/sidebarSlice';
import {PreloadedState, SliceNames} from './types';

const combinedReducer = combineReducers({
  [SliceNames.eventsSlice]: eventsSlice.reducer,
  [SliceNames.dateSlice]: dateSlice.reducer,
  [SliceNames.overflowSlice]: overflowSlice.reducer,
  [SliceNames.myCalendarsSlice]: myCalendarsSlice.reducer,
  [holidaysApi.reducerPath]: holidaysApi.reducer,
  [SliceNames.sidebarSlice]: sidebarSlice.reducer,
  [SliceNames.dayNotesSlice]: dayNotesSlice.reducer,
  [SliceNames.locationSlice]: locationSlice.reducer,
  [conditionsApi.reducerPath]: conditionsApi.reducer,
});

export const setupStore = (preloadedState?: PreloadedState) => {
  return configureStore({
    reducer: combinedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(holidaysApi.middleware, conditionsApi.middleware, listenerMiddleware.middleware),
    preloadedState,
  });
};

const store = setupStore();

export type AppStoreState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof combinedReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
