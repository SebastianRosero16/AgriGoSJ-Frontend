/**
 * HTTP Client with Interceptors
 * Handles JWT tokens, request queue, and error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '@/utils/constants';
import { Queue } from '@/data-structures';
import type { APIError } from '@/types';

/**
 * Queued Request Interface
 */
interface QueuedRequest {
  config: AxiosRequestConfig;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

/**
 * HTTP Client Class
 */
class HTTPClient {
  private axiosInstance: AxiosInstance;
  private requestQueue: Queue<QueuedRequest>;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.requestQueue = new Queue<QueuedRequest>();
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request
            return new Promise((resolve, reject) => {
              this.requestQueue.enqueue({
                config: originalRequest,
                resolve,
                reject,
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            
            if (newToken) {
              this.processQueue(newToken);
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(null);
            this.clearAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  /**
   * Process queued requests after token refresh
   */
  private processQueue(token: string | null): void {
    while (!this.requestQueue.isEmpty()) {
      const queuedRequest = this.requestQueue.dequeue();
      
      if (queuedRequest) {
        if (token) {
          queuedRequest.config.headers = queuedRequest.config.headers || {};
          queuedRequest.config.headers.Authorization = `Bearer ${token}`;
          this.axiosInstance(queuedRequest.config)
            .then(queuedRequest.resolve)
            .catch(queuedRequest.reject);
        } else {
          queuedRequest.reject(new Error('Token refresh failed'));
        }
      }
    }
  }

  /**
   * Refresh JWT token
   */
  private async refreshToken(): Promise<string | null> {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      // In a real scenario, call refresh endpoint
      // For now, we'll just return the existing token
      // TODO: Implement actual refresh logic when backend endpoint is available
      return token;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get stored token
   */
  private getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Normalize error response
   */
  private normalizeError(error: AxiosError): APIError {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      return {
        message: data?.message || this.getErrorMessageByStatus(status),
        status,
        errors: data?.errors,
      };
    }

    if (error.request) {
      return {
        message: ERROR_MESSAGES.NETWORK_ERROR,
        status: 0,
      };
    }

    return {
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      status: 0,
    };
  }

  /**
   * Get error message by HTTP status
   */
  private getErrorMessageByStatus(status: number): string {
    switch (status) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 408:
        return ERROR_MESSAGES.TIMEOUT_ERROR;
      case 500:
      case 502:
      case 503:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  /**
   * Set auth token
   */
  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  /**
   * Remove auth token
   */
  removeToken(): void {
    this.clearAuth();
  }

  /**
   * Get axios instance for advanced usage
   */
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

/**
 * Export singleton instance
 */
export const httpClient = new HTTPClient();
