import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/authSlice';

export const AppLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '15px 30px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #ddd' 
      }}>
        {/* Ссылки для навигации */}
        <nav style={{ display: 'flex', gap: '20px', flex: 1 }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
            Мои документы
          </Link>
          <Link to="/profile" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
            Профиль
          </Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Привет, {user?.name || 'Пользователь'}!</span>
          <button 
            onClick={handleLogout}
            style={{ padding: '5px 15px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Выйти
          </button>
        </div>
      </header>

      <main style={{ padding: '20px', flex: 1 }}>
        <Outlet />
      </main>

    </div>
  );
};