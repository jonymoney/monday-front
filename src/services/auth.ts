import { TOKEN_KEY } from '@/config/constants';

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  parseJwt: (token: string) => {
    try {
      const base64 = token.split('.')[1];
      const decoded = atob(base64);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  },

  isTokenExpired: (token: string) => {
    const payload = auth.parseJwt(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }
};
