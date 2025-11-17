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
  login: (credentials: LoginRequest) => Promise<User>;
  register: (userData: RegisterRequest) => Promise<User>;
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
  const login = async (credentials: LoginRequest): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      console.log('Respuesta en AuthContext:', response);
      console.log('Usuario:', response.user);
      console.log('Rol del usuario:', response.user?.role);
      
      // Handle different response structures
      let userData: User;
      
      // Case 1: response has user property
      if (response.user) {
        userData = response.user;
      } 
      // Case 2: response IS the user (no wrapper)
      else if ((response as any).role) {
        userData = response as any as User;
      }
      // Case 3: Try to get token and find user data
      else {
        throw new Error('Invalid response structure from backend');
      }
      
      // Extract token
      const token = response.token || (response as any).accessToken || '';
      
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register user
   */
  const registerUser = async (userData: RegisterRequest): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      
      // Handle different response structures
      let user: User;
      
      // Case 1: response has user property
      if (response.user) {
        user = response.user;
      } 
      // Case 2: response IS the user (no wrapper)
      else if ((response as any).role) {
        user = response as any as User;
      }
      // Case 3: Invalid structure
      else {
        throw new Error('Invalid response structure from backend');
      }
      
      // Extract token
      const token = response.token || (response as any).accessToken || '';
      
      setUser(user);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      
      return user;
    } catch (error) {
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
