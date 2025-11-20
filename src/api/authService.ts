/**
 * Authentication API Service
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/utils/constants';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

/**
 * Validate Email Response
 */
export interface ValidateEmailResponse {
  valid: boolean;
  gmail?: boolean;
  validGmailFormat?: boolean;
  reason?: string;
  email: string;
}

/**
 * Verification Code Response
 */
export interface VerificationCodeResponse {
  success: boolean;
  message: string;
  expiresIn?: string;
  note?: string;
  email?: string;
  verified?: boolean;
  error?: string;
}

/**
 * Check Verification Response
 */
export interface CheckVerificationResponse {
  email: string;
  verified: boolean;
  message: string;
}

/**
 * Verify Email Exists Response
 */
export interface VerifyEmailExistsResponse {
  exists: boolean;
  message: string;
}

/**
 * Forgot Password Response
 */
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  token?: string;
  note?: string;
}

/**
 * Reset Password Response
 */
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Auth Service Class
 */
class AuthService {
  /**
   * User login
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
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
   * Validate email format and domain
   */
  async validateEmail(email: string): Promise<ValidateEmailResponse> {
    return await httpClient.post<ValidateEmailResponse>(
      API_ENDPOINTS.AUTH.VALIDATE_EMAIL,
      { email }
    );
  }

  /**
   * Send verification code to email
   */
  async sendVerificationCode(email: string, username?: string): Promise<VerificationCodeResponse> {
    // New backend requires username in the payload when available
    const payload: any = { email };
    if (username) payload.username = username;

    return await httpClient.post<VerificationCodeResponse>(
      API_ENDPOINTS.AUTH.SEND_VERIFICATION_CODE,
      payload
    );
  }

  /**
   * Verify code entered by user
   */
  async verifyCode(email: string, code: string): Promise<VerificationCodeResponse> {
    return await httpClient.post<VerificationCodeResponse>(
      API_ENDPOINTS.AUTH.VERIFY_CODE,
      { email, code }
    );
  }

  /**
   * Check if email is verified
   */
  async checkVerification(email: string): Promise<CheckVerificationResponse> {
    return await httpClient.get<CheckVerificationResponse>(
      API_ENDPOINTS.AUTH.CHECK_VERIFICATION(email)
    );
  }

  /**
   * Verify if email exists in system
   */
  async verifyEmailExists(email: string): Promise<VerifyEmailExistsResponse> {
    return await httpClient.post<VerifyEmailExistsResponse>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      { email }
    );
  }

  /**
   * Request password reset token
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return await httpClient.post<ForgotPasswordResponse>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    return await httpClient.post<ResetPasswordResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, newPassword }
    );
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
