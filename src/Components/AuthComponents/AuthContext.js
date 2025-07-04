import { createContext } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  userRole: null,
  setIsAuthenticated: () => {},
  setUserRole: () => {},
});

