import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const savedUserData = localStorage.getItem('user_data');
const parsedUser = savedUserData ? JSON.parse(savedUserData) : null;

const initialState: AuthState = {
  isAuthenticated: parsedUser !== null,
  user: parsedUser,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('user_data', JSON.stringify(action.payload)); 
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('user_data');
      localStorage.removeItem('mock_token');
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;