import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface DocumentMeta {
  id: string;
  title: string;
  createdAt: string;
}

interface DocumentsState {
  list: DocumentMeta[];
}

const savedDocs = localStorage.getItem('spreadsheet_docs');
const initialState: DocumentsState = {
  list: savedDocs ? JSON.parse(savedDocs) : [],
};

export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    createDocument: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const newDoc: DocumentMeta = {
        id: action.payload.id,
        title: action.payload.title,
        createdAt: new Date().toLocaleString(), 
      };
      state.list.push(newDoc);
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(doc => doc.id !== action.payload);
    }
  }
});

export const { createDocument, deleteDocument } = documentsSlice.actions;
export default documentsSlice.reducer;