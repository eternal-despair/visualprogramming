import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/authSlice';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Некорректный формат email');
      return;
    }

    if (password.length < 8) {
      setError('Пароль должен быть не менее 8 символов');
      return;
    }

    setError('');
    
    const generatedName = email.split('@')[0];

    dispatch(loginSuccess({ name: generatedName, email }));
    navigate('/dashboard'); 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <form 
        onSubmit={handleLogin} 
        style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}
      >
        <h2>Вход в систему</h2>
        
        {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}

        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Войти
        </button>

        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <Link to="/register">Нет аккаунта? Регистрация</Link>
        </div>
      </form>
    </div>
  );
};