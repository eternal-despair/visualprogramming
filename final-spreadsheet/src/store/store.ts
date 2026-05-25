import { configureStore } from '@reduxjs/toolkit';
import spreadsheetReducer from './spreadsheetSlice';
import authReducer from './authSlice'; 
import documentsReducer from './documentsSlice'; 

export const store = configureStore({
  reducer: {
    spreadsheet: spreadsheetReducer,
    documents: documentsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;