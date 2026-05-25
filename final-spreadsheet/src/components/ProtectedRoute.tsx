import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Читаем из Redux, авторизован ли пользователь
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  //если нет - принудительно перекидываем на /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //рендерим страницу (Дашборд или Таблицу)
  return <>{children}</>;
};