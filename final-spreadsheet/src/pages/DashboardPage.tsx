import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { createDocument, deleteDocument } from '../store/documentsSlice';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const documents = useAppSelector((state) => state.documents.list);

  // Сохраняем список документов в память браузера при любых изменениях
  useEffect(() => {
    localStorage.setItem('spreadsheet_docs', JSON.stringify(documents));
  }, [documents]);


  const handleCreateNew = () => {
    const title = prompt('Введите название новой таблицы:', 'Новая таблица');
    if (!title) return;

    const newId = `doc-${Date.now()}`;
    
    dispatch(createDocument({ id: newId, title }));
    
    navigate(`/documents/${newId}`);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Мои документы</h1>
      
      <button 
        onClick={handleCreateNew}
        style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '20px', cursor: 'pointer', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        + Создать новую таблицу
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {documents.length === 0 ? (
          <p>У вас пока нет документов. Создайте первый!</p>
        ) : (
          documents.map((doc) => (
            <div 
              key={doc.id}
              style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '220px', background: '#f8f9fa' }}
            >
              <h3 
                style={{ margin: '0 0 10px 0', cursor: 'pointer', color: '#1a73e8' }}
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                📊 {doc.title}
              </h3>
              <p style={{ fontSize: '12px', color: 'gray', marginBottom: '15px' }}>
                Создан: {doc.createdAt}
              </p>
              <button 
                onClick={() => {
                  if (window.confirm('Точно удалить?')) {
                    dispatch(deleteDocument(doc.id));
                  }
                }}
                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Удалить
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};