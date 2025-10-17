import { create } from 'zustand';
import { auth } from '@/services/auth';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: auth.getToken(),

  login: (token, user) => {
    auth.setToken(token);
    set({ token, user });
  },

  logout: () => {
    auth.removeToken();
    set({ token: null, user: null });
  },

  checkAuth: () => auth.isAuthenticated()
}));
