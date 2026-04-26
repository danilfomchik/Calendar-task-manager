import {TypedAddListener, TypedStartListening, addListener, createListenerMiddleware} from '@reduxjs/toolkit';

import type {AppDispatch, RootState} from './store';

export const listenerMiddleware = createListenerMiddleware();

// Create a pre-typed startListening function
export const startAppListening = listenerMiddleware.startListening as TypedStartListening<RootState, AppDispatch>;
// Optional: If you need to add listeners dynamically later
export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>;
