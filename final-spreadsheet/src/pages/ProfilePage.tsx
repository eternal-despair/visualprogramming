import React from 'react';
import { useAppSelector } from '../store/hooks';

export const ProfilePage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <h1>Профиль пользователя</h1>
      <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', maxWidth: '400px' }}>
        <p><strong>Имя:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
    </div>
  );
};