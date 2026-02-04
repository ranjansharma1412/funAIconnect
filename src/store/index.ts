import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './slices/modalSlice';
import networkReducer from './slices/networkSlice';

export const store = configureStore({
    reducer: {
        modal: modalReducer,
        network: networkReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable for non-serializable checks if needed
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
