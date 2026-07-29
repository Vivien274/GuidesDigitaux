'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { upsertUserProfileToDb } from '@/lib/supabaseLms';

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

const SUPERADMIN_EMAILS = [
  'vivien274@gmail.com',
  'contact@guides-digitaux.com',
  'stephanie@guides-digitaux.com'
];

const FORMATEUR_EMAILS = [
  'contact@spoolio.fr',
  'formateur@guides-digitaux.com'
];

export function getRoleForEmail(email: string, requestedRole?: UserRole): UserRole {
  const normalized = (email || '').toLowerCase().trim();

  // 1. Superadmin official accounts
  if (SUPERADMIN_EMAILS.includes(normalized)) {
    return 'superadmin';
  }

  // 2. Formateur official accounts
  if (FORMATEUR_EMAILS.includes(normalized)) {
    return 'formateur';
  }

  // 3. Dynamically created formateur accounts (excluding student emails)
  if (typeof window !== 'undefined') {
    try {
      const storedFormateurs = JSON.parse(localStorage.getItem('gd_formateur_accounts') || '[]');
      if (storedFormateurs.some((f: any) => f.email?.toLowerCase().trim() === normalized)) {
        if (normalized !== 'vbocquelet@gmail.com') {
          return 'formateur';
        }
      }
    } catch (e) {
      console.error('Error checking formateur accounts', e);
    }
  }

  // 4. All other emails default strictly to 'eleve'
  return 'eleve';
}

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
          const computedRole = getRoleForEmail(parsed.email, parsed.role);
          parsed.role = computedRole;
          setUser(parsed);
          setRoleState(computedRole);
        } else {
          // Default state for new visitors: no logged in user, role is 'eleve'
          setUser(null);
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
    const computedRole = getRoleForEmail(email, targetRole);
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split('@')[0].replace('.', ' '),
      role: computedRole
    };
    setUser(newUser);
    setRoleState(computedRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gd_auth_user', JSON.stringify(newUser));
      try {
        const registered = JSON.parse(localStorage.getItem('gd_all_registered_users') || '[]');
        if (!registered.some((u: any) => u.email?.toLowerCase().trim() === email.toLowerCase().trim())) {
          registered.push({ email, role: computedRole, fullName: newUser.fullName, createdAt: new Date().toISOString() });
          localStorage.setItem('gd_all_registered_users', JSON.stringify(registered));
        }
      } catch (e) {}
    }
    upsertUserProfileToDb(email, computedRole, newUser.fullName);
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
