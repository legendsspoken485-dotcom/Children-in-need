import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types';

interface AuthContextType {
  currentUser: AuthUser;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  canAccessAdmin: boolean;
  canManageSafeguarding: boolean;
  canVerifyCases: boolean;
  canAuthorizeFunds: boolean;
  loginAs: (user: AuthUser) => void;
  logout: () => void;
}

const DEFAULT_USERS: Record<UserRole, AuthUser> = {
  public: {
    id: 'usr-public',
    name: 'Public Visitor',
    email: 'visitor@hopebridge.org',
    role: 'public'
  },
  donor: {
    id: 'usr-donor',
    name: 'Elena Rostova',
    email: 'elena.rostova@gmail.com',
    role: 'donor',
    badgeNumber: 'DON-2026-991'
  },
  volunteer: {
    id: 'usr-vol-01',
    name: 'David M. Lindqvist',
    email: 'd.lindqvist.volunteer@hopebridge.org',
    role: 'volunteer',
    badgeNumber: 'VOL-SWE-419',
    verifiedAt: '2026-08-12'
  },
  partner_lead: {
    id: 'usr-part-01',
    name: 'Dr. Joseph Lokiru',
    email: 'turkana.mission@hopebridge.org',
    role: 'partner_lead',
    organization: 'Turkana Community Water & Health Mission',
    badgeNumber: 'NGO-KE-881'
  },
  case_worker: {
    id: 'usr-cw-01',
    name: 'Marcus Vance',
    email: 'marcus.vance@hopebridge.org',
    role: 'case_worker',
    badgeNumber: 'CW-INTL-104',
    verifiedAt: '2026-01-10'
  },
  safeguarding_officer: {
    id: 'usr-so-01',
    name: 'Dr. Hector Morales, MD',
    email: 'safeguarding@hopebridge.org',
    role: 'safeguarding_officer',
    badgeNumber: 'CPO-HON-009',
    verifiedAt: '2025-11-01'
  },
  admin: {
    id: 'usr-adm-01',
    name: 'Audrey Sinclair (Director)',
    email: 'admin@hopebridge.org',
    role: 'admin',
    badgeNumber: 'EXEC-001',
    verifiedAt: '2025-06-01'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'hopebridge_auth_user_role';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('public');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(AUTH_STORAGE_KEY) as UserRole | null;
        if (saved && DEFAULT_USERS[saved]) {
          setCurrentRole(saved);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(AUTH_STORAGE_KEY, role);
      }
    } catch {
      // ignore
    }
  };

  const loginAs = (user: AuthUser) => {
    switchRole(user.role);
  };

  const logout = () => {
    switchRole('public');
  };

  const currentUser = DEFAULT_USERS[currentRole] || DEFAULT_USERS.public;

  const isAuthenticated = currentRole !== 'public';
  const canAccessAdmin = currentRole === 'admin' || currentRole === 'safeguarding_officer' || currentRole === 'case_worker';
  const canManageSafeguarding = currentRole === 'admin' || currentRole === 'safeguarding_officer';
  const canVerifyCases = currentRole === 'admin' || currentRole === 'case_worker' || currentRole === 'safeguarding_officer';
  const canAuthorizeFunds = currentRole === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchRole,
        isAuthenticated,
        canAccessAdmin,
        canManageSafeguarding,
        canVerifyCases,
        canAuthorizeFunds,
        loginAs,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
