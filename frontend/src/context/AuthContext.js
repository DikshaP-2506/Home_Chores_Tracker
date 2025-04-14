import { createContext } from 'react';

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  login: () => {},
  logout: () => {}
});

export default AuthContext;