import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DragonState {
  minutes: number;
}

const initialState: DragonState = {
  minutes: 0,
};

export const dragonSlice = createSlice({
  name: 'dragon',
  initialState,
  reducers: {
    setMinutes: (state, action: PayloadAction<number>) => {
      state.minutes = action.payload;
    },
  },
});

export const { setMinutes } = dragonSlice.actions;

export default dragonSlice.reducer;
