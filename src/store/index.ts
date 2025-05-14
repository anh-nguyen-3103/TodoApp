import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../reducers/appReducer';
import taskReducer from '../reducers/taskReducer';

export const store = configureStore({
    reducer: {
        app: appReducer,
        task: taskReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
