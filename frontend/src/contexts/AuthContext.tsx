import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthContextType } from '../types';
import type { ReactNode } from 'react';
import { BACKEND_URL } from '../URLs';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check localStorage on initialization to restore user session
  useEffect(() => {
    const initializeAuth = async () => {
      const storedEmail = localStorage.getItem('user_email');
      const storedPassword = localStorage.getItem('user_password');
      
      if (storedEmail && storedPassword) {
        // Validate stored credentials with the backend
        try {
          const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: storedEmail, password: storedPassword }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUser({ email: storedEmail });
            } else {
              // Invalid credentials, clear localStorage
              localStorage.removeItem('user_email');
              localStorage.removeItem('user_password');
            }
          } else {
            // Server error, clear localStorage
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_password');
          }
        } catch (error) {
          console.error('Auto-login error:', error);
          // Network error, but keep credentials for retry later
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser({ email });
          // Store credentials securely for websocket usage
          localStorage.setItem('user_email', email);
          localStorage.setItem('user_password', password);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Auto-login after successful registration
          return await login(email, password);
        }
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_password');
  }, []);

  const isAuthenticated = user !== null;

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
