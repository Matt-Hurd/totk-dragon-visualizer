import { configureStore } from '@reduxjs/toolkit';
import dragonReducer from './slice';

export const store = configureStore({
  reducer: {
    dragon: dragonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
