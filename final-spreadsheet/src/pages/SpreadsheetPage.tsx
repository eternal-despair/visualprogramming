import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table } from '../components/Table';
import { useAppDispatch } from '../store/hooks';
import { loadDocument, addRow, addColumn, importData } from '../store/spreadsheetSlice';

export const SpreadsheetPage: React.FC = () => {
  const navigate = useNavigate();
  const { documentId } = useParams(); 
  const dispatch = useAppDispatch();

  //состояние для самодельного контекстного меню
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean }>({ x: 0, y: 0, visible: false });

  useEffect(() => {
    if (documentId) {
      dispatch(loadDocument(documentId));
    }
  }, [documentId, dispatch]);

  // контекст менюха
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); 
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      visible: true
    });
  };

  const closeMenu = () => {
    if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
  };


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n');
      
      const newCells: Record<string, string> = {};
      
      rows.forEach((row, rowIndex) => {
        const cols = row.split(','); 
        cols.forEach((val, colIndex) => {
          const colLetter = String.fromCharCode(65 + colIndex); 
          const cellId = `${colLetter}${rowIndex + 1}`; 
          
          if (val.trim()) {
            newCells[cellId] = val.trim();
          }
        });
      });

      dispatch(importData(newCells));
    };
    
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '10px', minHeight: '100vh' }} onClick={closeMenu}>
      
      {/*(Кнопка Назад и Импорт) */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ padding: '5px 10px', cursor: 'pointer', background: '#e0e0e0', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          ← Назад
        </button>

        {/* Кнопка импорта (скрытый input и видимый label) */}
        <label style={{ padding: '5px 10px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          Импорт CSV
          <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>
      </div>
      
      {/* Обертка для таблицы, на которую мы вешаем перехват правого клика */}
      <div onContextMenu={handleContextMenu}>
        <Table /> 
      </div>

      {contextMenu.visible && (
        <div 
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <button 
            onClick={() => { dispatch(addRow()); closeMenu(); }}
            style={{ padding: '10px 15px', background: 'none', border: 'none', borderBottom: '1px solid #eee', cursor: 'pointer', textAlign: 'left' }}
          >
            Добавить строку вниз
          </button>
          <button 
            onClick={() => { dispatch(addColumn()); closeMenu(); }}
            style={{ padding: '10px 15px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            Добавить столбец вправо
          </button>
        </div>
      )}

    </div>
  );
};