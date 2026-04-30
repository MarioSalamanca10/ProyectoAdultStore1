import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar si hay sesión guardada en localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      setIsAdmin(true);
    }
  }, []);

  const login = (username, password) => {
    const ADMIN_USER = 'admin';
    const ADMIN_PASSWORD = 'Tobias2025*!';

    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setIsAdmin(true);
      localStorage.setItem('adminAuth', 'true');
      return { success: true };
    }
    return { success: false, error: 'Usuario o contraseña incorrectos' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('adminAuth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
