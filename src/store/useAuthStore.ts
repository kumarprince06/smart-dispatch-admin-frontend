import { create } from 'zustand';
import apiClient from '../api/client';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string, userData: User) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, // Start true while we check localStorage

  login: (token, refreshToken, userData) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    set({
      user: userData,
      accessToken: token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    // Attempt to notify the backend to revoke the token
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken });
      } catch (e) {
        console.error('Failed to notify backend of logout', e);
      }
    }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initialize: () => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_data');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        set({
          user: parsedUser,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
      }
    }
    
    // No valid token/user found
    set({ isLoading: false, isAuthenticated: false, user: null });
  },
}));
