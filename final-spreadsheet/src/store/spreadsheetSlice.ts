import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface TableSnapshot {
  cells: Record<string, string>;
  formats: Record<string, React.CSSProperties>;
}

interface SpreadsheetState {
  documentId: string | null;
  cells: Record<string, string>;
  formats: Record<string, React.CSSProperties>;
  past: TableSnapshot[];
  future: TableSnapshot[];
  rowCount: number;
  colCount: number;
}

const initialState: SpreadsheetState = {
  documentId: null,
  cells: {},
  formats: {},
  past: [],
  future: [],
  rowCount: 100,
  colCount: 26, 
};

export const spreadsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState,
  reducers: {
    loadDocument: (state, action: PayloadAction<string>) => {
      state.documentId = action.payload;
      const savedCells = localStorage.getItem(`cells_${action.payload}`);
      const savedFormats = localStorage.getItem(`formats_${action.payload}`);
      
      state.cells = savedCells ? JSON.parse(savedCells) : {};
      state.formats = savedFormats ? JSON.parse(savedFormats) : {};
      state.past = []; 
      state.future = [];
    },

    saveHistory: (state) => {
      state.past.push({ 
        cells: { ...state.cells }, 
        formats: { ...state.formats } 
      });
      state.future = []; 
    },
    
    updateCell: (state, action: PayloadAction<{ id: string; value: string }>) => {
      state.cells[action.payload.id] = action.payload.value;
    },
    
    updateFormat: (state, action: PayloadAction<{ id: string; property: keyof React.CSSProperties; value: any }>) => {
      state.past.push({ cells: { ...state.cells }, formats: { ...state.formats } });
      state.future = [];

      const { id, property, value } = action.payload;
      if (!state.formats[id]) state.formats[id] = {};
      
      if (state.formats[id][property] === value) {
        state.formats[id][property] = undefined;
      } else {
        state.formats[id][property] = value;
      }
    },

    undo: (state) => {
      if (state.past.length > 0) {
        const previous = state.past.pop();
        if (previous) {
          state.future.push({ cells: { ...state.cells }, formats: { ...state.formats } });
          state.cells = previous.cells;
          state.formats = previous.formats;
        }
      }
    },

    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future.pop();
        if (next) {
          state.past.push({ cells: { ...state.cells }, formats: { ...state.formats } });
          state.cells = next.cells;
          state.formats = next.formats;
        }
      }
    },

    addRow: (state) => { state.rowCount += 1; },
    addColumn: (state) => { state.colCount += 1; },

        importData: (state, action: PayloadAction<Record<string, string>>) => {
      state.past.push({ 
        cells: { ...state.cells }, 
        formats: { ...state.formats } 
      });
      state.future = []; 

      state.cells = action.payload;
    }
  }
});


export const { loadDocument, saveHistory, updateCell, updateFormat, undo, redo, addRow, addColumn, importData } = spreadsheetSlice.actions;
export default spreadsheetSlice.reducer;