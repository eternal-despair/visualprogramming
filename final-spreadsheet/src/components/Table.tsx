import React, { useState, useEffect } from 'react';
import './Table.css';
import { evaluateFormula } from '../utils/formulas';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateCell, saveHistory, updateFormat, undo, redo } from '../store/spreadsheetSlice';

const COLS = 26;
const ROWS = 100;
const getColumnName = (index: number) => String.fromCharCode(65 + index);

export const Table: React.FC = () => {
  //1. достаем данные из редукс
  const cells = useAppSelector((state) => state.spreadsheet.cells);
  const formats = useAppSelector((state) => state.spreadsheet.formats);
  const dispatch = useAppDispatch(); // Отправитель команд в Redux
  const documentId = useAppSelector((state) => state.spreadsheet.documentId);

  // Локальные состояния интерфейса оставляем в useState (ТЗ разрешает)
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<string | null>(null);


  //2. автосохранние
  useEffect(() => {
    if (documentId) {
      localStorage.setItem(`cells_${documentId}`, JSON.stringify(cells));
    }
  }, [cells, documentId]); // следим за изменением cells и documentId

  useEffect(() => {
    if (documentId) {
      localStorage.setItem(`formats_${documentId}`, JSON.stringify(formats));
    }
  }, [formats, documentId]);

  //3. функция экспорта
  const exportToCSV = () => {
    let csvContent = "";
    for (let r = 1; r <= ROWS; r++) {
      let row = [];
      for (let c = 0; c < COLS; c++) {
        const cellId = `${getColumnName(c)}${r}`;
        const rawValue = cells[cellId] || '';
        const displayValue = evaluateFormula(rawValue, cells);
        row.push(`"${displayValue}"`); 
      }
      csvContent += row.join(",") + "\n";
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "моя_таблица.csv";
    link.click();
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify({ cells, formats }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "бэкап_таблицы.json";
    link.click();
  };

  //4. обновления
  const handleCellChange = (id: string, value: string) => {
    dispatch(updateCell({ id, value }));
  };

  const handleFormatChange = (property: keyof React.CSSProperties, value: any) => {
    if (!selectedCell) return;
    dispatch(updateFormat({ id: selectedCell, property, value }));
  };

//5. хоткейс
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingCell) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault(); 
        dispatch(saveHistory());
        dispatch(undo());
        return; 
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        dispatch(saveHistory());
        dispatch(redo());
        return;
      }

      if (!selectedCell || editingCell) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        setClipboard(cells[selectedCell] || '');
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        if (clipboard !== null) {
          dispatch(saveHistory());
           dispatch(updateCell({ id: selectedCell, value: clipboard }));
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        dispatch(saveHistory());
        dispatch(updateCell({ id: selectedCell, value: '' }));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        dispatch(saveHistory());
        setEditingCell(selectedCell);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, editingCell, cells, clipboard, dispatch]);
  const activeId = editingCell || selectedCell;


  //5. отрисовка интерфейса
  return (
    <div className="spreadsheet-layout">
      
      {/* Панель инструментов (Жирный, Курсив, Цвет, Экспорт) */}
      <div className="toolbar">
        <button 
          className="toolbar-btn" 
          style={{ fontWeight: 'bold' }}
          onClick={() => handleFormatChange('fontWeight', 'bold')}
        >B</button>
        <button 
          className="toolbar-btn" 
          style={{ fontStyle: 'italic' }}
          onClick={() => handleFormatChange('fontStyle', 'italic')}
        >I</button>
        <button 
          className="toolbar-btn" 
          style={{ textDecoration: 'underline' }}
          onClick={() => handleFormatChange('textDecoration', 'underline')}
        >U</button>
        
        <span className="toolbar-separator">|</span>
        
        <input 
          type="color" 
          title="Цвет текста"
          className="color-picker"
          onChange={(e) => handleFormatChange('color', e.target.value)}
        />
        <input 
          type="color" 
          title="Цвет фона"
          className="color-picker"
          onChange={(e) => handleFormatChange('backgroundColor', e.target.value)}
        />

        <span className="toolbar-separator">|</span>

        <button className="toolbar-btn" onClick={exportToCSV} title="Скачать для Excel">
        CSV
        </button>
        <button className="toolbar-btn" onClick={exportToJSON} title="Скачать бэкап">
        JSON
        </button>
      </div>

      {/* Панель формул */}
      <div className="formula-bar">
        <div className="formula-icon">fx</div>
        <div className="formula-cell-id">{activeId || ''}</div>
        <input
          className="formula-input"
          value={activeId ? (cells[activeId] || '') : ''}
          onFocus={() => {
             dispatch(saveHistory()); 
          }}
          onChange={(e) => activeId && handleCellChange(activeId, e.target.value)}
          disabled={!activeId}
          placeholder={activeId ? "Введите значение или формулу (напр. =SUM(A1:A3))..." : "Выберите ячейку..."}
        />
      </div>

      {/* Сама таблица */}
      <div className="table-container">
        <table className="spreadsheet">
          <thead>
            <tr>
              <th></th>
              {Array.from({ length: COLS }).map((_, colIndex) => (
                <th key={colIndex}>{getColumnName(colIndex)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS }).map((_, rowIndex) => {
              const rowNumber = rowIndex + 1;
              return (
                <tr key={rowNumber}>
                  <td className="row-header">{rowNumber}</td>
                  
                  {Array.from({ length: COLS }).map((_, colIndex) => {
                    const cellId = `${getColumnName(colIndex)}${rowNumber}`;
                    const isSelected = selectedCell === cellId;
                    const isEditing = editingCell === cellId;
                    
                    const rawValue = cells[cellId] || '';
                    const displayValue = evaluateFormula(rawValue, cells);
                    const cellStyle = formats[cellId] || {}; 

                    return (
                      <td 
                        key={cellId} 
                        className={isSelected ? 'selected' : ''}
                        style={{ backgroundColor: cellStyle.backgroundColor }}
                        onClick={() => {
                          if (editingCell !== cellId) setSelectedCell(cellId);
                        }}
                        onDoubleClick={() => {
                          dispatch(saveHistory());
                          setEditingCell(cellId);
                        }}
                      >
                        {isEditing ? (
                          <input
                            autoFocus
                            value={rawValue}
                            onChange={(e) => handleCellChange(cellId, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') setEditingCell(null);
                            }}
                          />
                        ) : (
                          <span style={cellStyle}>{displayValue}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};