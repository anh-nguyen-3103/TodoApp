import { createSlice } from '@reduxjs/toolkit';

export interface AppState {
}

const initialState: AppState = {
};

const appReducer = createSlice({
    name: 'app',
    initialState,
    reducers: {

    },
});

export const { } = appReducer.actions;
export default appReducer.reducer;
