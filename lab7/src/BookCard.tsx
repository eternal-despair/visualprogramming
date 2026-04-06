import React from 'react';

// Описываем пропсы (данные), которые принимает карточка
interface BookCardProps {
  title: string;
  authors: string[];
  coverBlobUrl: string | null;
}

export const BookCard: React.FC<BookCardProps> = ({ title, authors, coverBlobUrl }) => {
  return (
    <div className="book-card">
      <div className="cover-container">
        {coverBlobUrl ? (
          <img src={coverBlobUrl} alt={title} className="cover" />
        ) : (
          <div className="no-cover">Нет обложки</div>
        )}
      </div>
      {/* Название (крупнее) */}
      <h2 className="title">{title}</h2>
      {/* Авторы (мельче) */}
      <p className="authors">{authors ? authors.join(', ') : 'Автор неизвестен'}</p>
    </div>
  );
};