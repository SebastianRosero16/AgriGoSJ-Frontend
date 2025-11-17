/**
 * Store API Service
 * Handles agricultural inputs management
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { StoreInput, CreateStoreInputRequest, UpdateStoreInputRequest } from '@/types';

/**
 * Store Service Class
 */
class StoreService {
  /**
   * Get all inputs for current store
   */
  async getInputs(): Promise<StoreInput[]> {
    return await httpClient.get<StoreInput[]>(API_ENDPOINTS.STORE.INPUTS);
  }

  /**
   * Get input by ID
   */
  async getInputById(id: number): Promise<StoreInput> {
    return await httpClient.get<StoreInput>(API_ENDPOINTS.STORE.INPUT_BY_ID(id));
  }

  /**
   * Create new input
   */
  async createInput(input: CreateStoreInputRequest): Promise<StoreInput> {
    return await httpClient.post<StoreInput>(API_ENDPOINTS.STORE.INPUTS, input);
  }

  /**
   * Update existing input
   */
  async updateInput(id: number, input: UpdateStoreInputRequest): Promise<StoreInput> {
    return await httpClient.put<StoreInput>(API_ENDPOINTS.STORE.INPUT_BY_ID(id), input);
  }

  /**
   * Delete input
   */
  async deleteInput(id: number): Promise<void> {
    return await httpClient.delete(API_ENDPOINTS.STORE.INPUT_BY_ID(id));
  }
}

export const storeService = new StoreService();
