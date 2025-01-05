import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { SliceNames } from "./types";
import counterSlice from "./counter/counterSlice";

const combinedReducer = combineReducers({
    [SliceNames.counterSlice]: counterSlice.reducer,
});

const store = configureStore({
    reducer: combinedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppStoreState = ReturnType<typeof store.getState>;

export const setupStore = (preloadedState?: AppStoreState) => {
    return configureStore({
        reducer: combinedReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
        preloadedState,
    });
};

export type RootState = ReturnType<typeof combinedReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
