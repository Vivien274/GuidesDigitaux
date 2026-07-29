'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'superadmin' | 'formateur' | 'eleve';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRoleState] = useState<UserRole>('eleve');

  // Load user session from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('gd_auth_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setRoleState(parsed.role || 'eleve');
        } else {
          // Default demo user profile
          const defaultUser: UserProfile = {
            id: 'user-demo-123',
            email: 'stephanie@guides-digitaux.com',
            fullName: 'Stéphanie Rocq',
            role: 'eleve'
          };
          setUser(defaultUser);
          setRoleState('eleve');
        }
      }
    } catch (e) {
      console.error('Failed to load auth session', e);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gd_auth_user', JSON.stringify(updated));
      }
    }
  };

  const login = (email: string, targetRole: UserRole = 'eleve') => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split('@')[0].replace('.', ' '),
      role: targetRole
    };
    setUser(newUser);
    setRoleState(targetRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gd_auth_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gd_auth_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setRole,
        login,
        logout,
        isLoggedIn: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
