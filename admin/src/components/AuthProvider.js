import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/api'; // Correct path to services

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const response = await loginService(username, password);
      if (response.data.success) {
        const newToken = response.data.token;
        setToken(newToken);
        localStorage.setItem('adminToken', newToken);
        navigate('/'); // Navigate to dashboard on success
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);