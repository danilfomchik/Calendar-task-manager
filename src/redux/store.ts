import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import { PreloadedState, SliceNames } from "./types";
import counterSlice from "./columns/columnsSlice";

const combinedReducer = combineReducers({
  [SliceNames.columnsSlice]: counterSlice.reducer,
});

export const setupStore = (preloadedState?: PreloadedState) => {
  return configureStore({
    reducer: combinedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
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
