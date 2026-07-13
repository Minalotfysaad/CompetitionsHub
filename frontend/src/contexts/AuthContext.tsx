import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthUser, UserRole } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  login: (id: string, userName: string, email: string, role: UserRole, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'auth_user';

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as AuthUser;
    if (!user.token) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser);

  const login = useCallback(
    (id: string, userName: string, email: string, role: UserRole, token: string) => {
      const authUser: AuthUser = { id, userName, email, role, token };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
