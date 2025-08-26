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
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Utility: SHA-1 hash as hex string
  const sha1Hex = async (input: string): Promise<string> => {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-1', data);
    const bytes = new Uint8Array(digest);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Check localStorage on initialization to restore user session
  useEffect(() => {
    const initializeAuth = async () => {
      const storedEmail = localStorage.getItem('user_email');
      const storedToken = localStorage.getItem('auth_token');
      if (storedEmail && storedToken) {
        try {
          // Probe a protected endpoint to validate token
          const resp = await fetch(`${BACKEND_URL}/slots/user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`,
            },
            body: JSON.stringify({ token: storedToken }),
          });
          if (resp.ok) {
            setUser({ email: storedEmail });
            setToken(storedToken);
          } else {
            localStorage.removeItem('user_email');
            localStorage.removeItem('auth_token');
          }
        } catch (error) {
          console.error('Auto-login error:', error);
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const passwordSha1 = await sha1Hex(password);
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: passwordSha1 }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.token) {
          setUser({ email });
          setToken(data.token);
          localStorage.setItem('user_email', email);
          localStorage.setItem('auth_token', data.token);
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
      const passwordSha1 = await sha1Hex(password);
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: passwordSha1 }),
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
  setToken(null);
  localStorage.removeItem('user_email');
  localStorage.removeItem('auth_token');
  }, []);

  const isAuthenticated = user !== null;

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isInitialized,
  token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
