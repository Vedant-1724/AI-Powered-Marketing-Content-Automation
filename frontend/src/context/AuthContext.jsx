import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('markai_token');
    const savedUser = localStorage.getItem('markai_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('markai_token', data.token);
    localStorage.setItem('markai_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (fullName, email, password, companyName) => {
    const { data } = await authAPI.register({ fullName, email, password, companyName });
    localStorage.setItem('markai_token', data.token);
    localStorage.setItem('markai_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('markai_token');
    localStorage.removeItem('markai_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
