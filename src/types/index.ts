/**
 * Base Types for the Application
 */

import { USER_ROLES, AI_RECOMMENDATION_TYPES } from '@/utils/constants';

/**
 * User Role Type
 */
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * User Model
 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  fullName?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Auth Response
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Login Request
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  fullName?: string;
}

/**
 * Crop Model
 */
export interface Crop {
  id: number;
  name: string;
  type: string;
  plantedDate: string;
  area: number;
  location: string;
  status: string;
  notes?: string;
  farmerId: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Create Crop Request
 */
export interface CreateCropRequest {
  cropName: string;
  cropType: string;
  plantedDate: string;
  area: number;
  location: string;
  status: string;
  notes?: string;
}

/**
 * Update Crop Request
 */
export interface UpdateCropRequest extends Partial<CreateCropRequest> {}

/**
 * Store Input Model
 */
export interface StoreInput {
  id: number;
  name: string;
  type: string;
  description?: string;
  price: number;
  stock: number;
  unit: string;
  storeId: number;
  storeName?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Create Store Input Request
 */
export interface CreateStoreInputRequest {
  name: string;
  type: string;
  description?: string;
  price: number;
  stock: number;
  unit: string;
}

/**
 * Update Store Input Request
 */
export interface UpdateStoreInputRequest extends Partial<CreateStoreInputRequest> {}

/**
 * Farmer Product Model
 */
export interface FarmerProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  imageUrl?: string;
  available: boolean;
  farmerId: number;
  farmerName?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Product Model (for marketplace)
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
  imageUrl?: string;
  farmerId?: number;
  farmerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create Product Request
 */
export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  stock?: number;
  unit: string;
  category: string;
  imageUrl?: string;
  available?: boolean;
}

/**
 * Update Product Request
 */
export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

/**
 * AI Recommendation Type
 */
export type AIRecommendationType = typeof AI_RECOMMENDATION_TYPES[keyof typeof AI_RECOMMENDATION_TYPES];

/**
 * AI Recommendation Request
 */
export interface AIRecommendationRequest {
  cropId: number;
  type: AIRecommendationType;
  context?: string;
}

/**
 * AI Recommendation Model
 */
export interface AIRecommendation {
  id: number;
  cropId: number;
  type: AIRecommendationType;
  content: string;
  confidence?: number;
  createdAt: string;
}

/**
 * Price Comparison Model
 */
export interface PriceComparison {
  inputId: number;
  inputName: string;
  prices: Array<{
    storeId: number;
    storeName: string;
    price: number;
    stock: number;
    unit: string;
  }>;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

/**
 * API Error Response
 */
export interface APIError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

/**
 * Pagination Request
 */
export interface PaginationRequest {
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Pagination Response
 */
export interface PaginationResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

/**
 * API Response Wrapper
 */
export interface APIResponse<T> {
  data: T;
  message?: string;
  status: number;
}

/**
 * Filter Options
 */
export interface FilterOptions {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Theme Type
 */
export type Theme = 'light' | 'dark';

/**
 * Toast Notification
 */
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

/**
 * Form Field Error
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Loading State
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

/**
 * Chart Data Point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

/**
 * Statistics
 */
export interface Statistics {
  totalCrops?: number;
  totalProducts?: number;
  totalInputs?: number;
  totalSales?: number;
  revenue?: number;
}
