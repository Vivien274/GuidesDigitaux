'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { fetchUserProfileFromDb, upsertUserProfileToDb, getKnownRoleForEmail } from '@/lib/supabaseLms';

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
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRoleState] = useState<UserRole>('eleve');

  // Load user session from localStorage on mount & sync with Supabase profiles table
  useEffect(() => {
    async function syncAuthSession() {
      try {
        if (typeof window !== 'undefined') {
          const savedUser = localStorage.getItem('gd_auth_user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed?.email) {
              const normalizedEmail = parsed.email.toLowerCase().trim();
              const knownRole = getKnownRoleForEmail(normalizedEmail);
              const dbProfile = await fetchUserProfileFromDb(normalizedEmail);
              const effectiveRole: UserRole = (dbProfile?.role && dbProfile.role !== 'eleve')
                ? (dbProfile.role as UserRole)
                : (knownRole !== 'eleve' ? knownRole : (parsed.role || 'eleve'));
              const updatedProfile: UserProfile = {
                id: dbProfile?.id || parsed.id || `usr_${Date.now()}`,
                email: normalizedEmail,
                fullName: dbProfile?.full_name || parsed.fullName || normalizedEmail.split('@')[0],
                role: effectiveRole
              };
              setUser(updatedProfile);
              setRoleState(effectiveRole);
              localStorage.setItem('gd_auth_user', JSON.stringify(updatedProfile));
              return;
            }
          }
          setUser(null);
          setRoleState('eleve');
        }
      } catch (e) {
        console.error('Failed to load auth session', e);
      }
    }
    syncAuthSession();
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gd_auth_user', JSON.stringify(updated));
      }
      upsertUserProfileToDb(user.email, newRole, user.fullName);
    }
  };

  const login = async (email: string, targetRole: UserRole = 'eleve') => {
    const normalizedEmail = email.toLowerCase().trim();
    const knownRole = getKnownRoleForEmail(normalizedEmail);
    const dbProfile = await fetchUserProfileFromDb(normalizedEmail);
    const effectiveRole: UserRole = (dbProfile?.role && dbProfile.role !== 'eleve')
      ? (dbProfile.role as UserRole)
      : (knownRole !== 'eleve' ? knownRole : targetRole);
    
    const newUser: UserProfile = {
      id: dbProfile?.id || `user-${Date.now()}`,
      email: normalizedEmail,
      fullName: dbProfile?.full_name || normalizedEmail.split('@')[0].replace('.', ' '),
      role: effectiveRole
    };
    
    setUser(newUser);
    setRoleState(effectiveRole);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('gd_auth_user', JSON.stringify(newUser));
    }
    
    await upsertUserProfileToDb(normalizedEmail, effectiveRole, newUser.fullName);
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
