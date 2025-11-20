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
    // Normalizar respuesta para manejar distintos formatos que pueda devolver el backend
    const data: any = await httpClient.get(API_ENDPOINTS.STORE.INPUTS);

    if (!data) return [];

    // Si ya es un array
    if (Array.isArray(data)) return data as StoreInput[];

    // Formato común: { data: [...] }
    if (Array.isArray(data.data)) return data.data as StoreInput[];

    // Otro formato común: { items: [...] }
    if (Array.isArray(data.items)) return data.items as StoreInput[];

    // Si la respuesta contiene la propiedad 'inputs'
    if (Array.isArray(data.inputs)) return data.inputs as StoreInput[];

    // Si la respuesta es un objeto con una sola entidad, devolverlo dentro de un array
    if (typeof data === 'object') return [data as StoreInput];

    return [];
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
