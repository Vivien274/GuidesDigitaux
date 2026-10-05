'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
  login: (email: string, password?: string, checkoutSessionId?: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gd_auth_user');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gd_auth_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.role || 'eleve';
        }
      } catch (e) {}
    }
    return 'eleve';
  });

  // Load user session from server cookie on mount
  useEffect(() => {
    async function syncAuthSession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.authenticated && data.user) {
          const userObj: UserProfile = {
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.fullName || data.user.email.split('@')[0],
            role: data.user.role || 'eleve'
          };
          setUser(userObj);
          setRoleState(userObj.role);
          if (typeof window !== 'undefined') {
            localStorage.setItem('gd_auth_user', JSON.stringify(userObj));
          }
          return;
        }

        // If no server session, clear state
        setUser(null);
        setRoleState('eleve');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('gd_auth_user');
        }
      } catch (e) {
        console.error('Failed to load auth session from server', e);
      }
    }
    syncAuthSession();
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
    }
  };

  const login = async (email: string, password?: string, checkoutSessionId?: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    const normalizedEmail = email.toLowerCase().trim();
    const providedPassword = (password || '').trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          password: providedPassword,
          checkoutSessionId
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Erreur lors de la connexion' };
      }

      const loggedUser: UserProfile = {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.fullName,
        role: data.user.role
      };

      if (!data.supabaseSession?.access_token || !data.supabaseSession?.refresh_token) {
        return { success: false, error: 'Session Supabase manquante.' };
      }

      const { error: sessionError } = await supabase.auth.setSession(data.supabaseSession);
      if (sessionError) {
        return { success: false, error: 'Impossible d’activer la session sécurisée.' };
      }

      setUser(loggedUser);
      setRoleState(loggedUser.role);

      if (typeof window !== 'undefined') {
        localStorage.setItem('gd_auth_user', JSON.stringify(loggedUser));
      }

      return { success: true, role: loggedUser.role };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erreur réseau lors de la connexion' };
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        fetch('/api/auth/logout', { method: 'POST' }),
        supabase.auth.signOut(),
      ]);
    } catch (e) {}

    setUser(null);
    setRoleState('eleve');

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
