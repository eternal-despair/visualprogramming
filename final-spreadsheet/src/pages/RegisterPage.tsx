import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/authSlice';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Простая валидация
    if (!name.trim()) {
      return setError('Имя не может быть пустым');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError('Некорректный формат email');
    }

    if (password.length < 8) {
      return setError('Пароль должен быть не менее 8 символов');
    }

    if (password !== confirmPassword) {
      return setError('Пароли не совпадают');
    }

    setError('');
    dispatch(loginSuccess({ name, email }));
    navigate('/dashboard'); 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <form 
        onSubmit={handleRegister} 
        style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}
      >
        <h2>Регистрация</h2>
        
        {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}

        <input 
          type="text" 
          placeholder="Имя" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <input 
          type="password" 
          placeholder="Повторите пароль" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Зарегистрироваться
        </button>

        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <Link to="/login">Уже есть аккаунт? Войти</Link>
        </div>
      </form>
    </div>
  );
};