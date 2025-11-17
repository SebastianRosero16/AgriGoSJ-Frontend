/**
 * Authentication API Service
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/utils/constants';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

/**
 * Auth Service Class
 */
class AuthService {
  /**
   * User login
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    console.log('Respuesta completa del backend:', response);
    return response;
  }

  /**
   * User registration
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return await httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if backend supports it
      // await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      httpClient.removeToken();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  }

  /**
   * Get current user from storage
   */
  getCurrentUser(): any | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }
}

export const authService = new AuthService();
