/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 * Prevents navigation back after login
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/api';
import { STORAGE_KEYS } from '@/utils/constants';
import type { User, LoginRequest, RegisterRequest } from '@/types';

/**
 * Auth Context Type
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

/**
 * Create Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Initialize auth state from storage
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Prevent back navigation after login
   */
  useEffect(() => {
    if (user) {
      // Add entry to history to prevent back navigation
      window.history.pushState(null, '', window.location.href);
      
      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [user]);

  /**
   * Login user
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      console.log('Login response:', response);
      
      // Ensure user data is properly structured (handle snake_case from backend)
      const userData: User = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        role: response.user.role,
        fullName: response.user.fullName || (response.user as any).full_name,
        createdAt: response.user.createdAt || (response.user as any).created_at,
        updatedAt: response.user.updatedAt || (response.user as any).updated_at,
      };
      
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register user
   */
  const registerUser = async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      console.log('Register response:', response);
      
      // Ensure user data is properly structured (handle snake_case from backend)
      const userDataProcessed: User = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        role: response.user.role,
        fullName: response.user.fullName || (response.user as any).full_name,
        createdAt: response.user.createdAt || (response.user as any).created_at,
        updatedAt: response.user.updatedAt || (response.user as any).updated_at,
      };
      
      setUser(userDataProcessed);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userDataProcessed));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      setIsLoading(false);
    }
  };

  /**
   * Update user data
   */
  const updateUser = (updatedUser: User): void => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register: registerUser,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Use Auth Hook
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
