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
    if (Array.isArray(data)) {
      // Normalize each item to expected shape
      return data.map(normalizeInput) as StoreInput[];
    }

    // Formato común: { data: [...] }
    if (Array.isArray(data.data)) return data.data.map(normalizeInput) as StoreInput[];

    // Otro formato común: { items: [...] }
    if (Array.isArray(data.items)) return data.items.map(normalizeInput) as StoreInput[];

    // Si la respuesta contiene la propiedad 'inputs'
    if (Array.isArray(data.inputs)) return data.inputs.map(normalizeInput) as StoreInput[];

    // Si la respuesta es un objeto con una sola entidad, devolverlo dentro de un array
    if (typeof data === 'object') return [normalizeInput(data as any) as StoreInput];

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
// Helper: normalize different backend shapes into the StoreInput interface
function normalizeInput(raw: any): StoreInput {
  if (!raw || typeof raw !== 'object') return raw as StoreInput;

  const name = raw.name || raw.inputName || raw.productName || raw.title || raw.nombre || '';
  const type = raw.type || raw.inputType || raw.category || raw.typeName || '';
  const price = Number(raw.price ?? raw.unitPrice ?? raw.valor ?? 0) || 0;
  const stock = Number(raw.stock ?? raw.quantity ?? raw.cantidad ?? 0) || 0;
  const unit = raw.unit || raw.unidad || raw.measureUnit || 'unidad';
  const description = raw.description || raw.descripcion || raw.desc || '';

  return {
    id: Number(raw.id ?? raw.inputId ?? raw._id ?? 0),
    name: String(name),
    type: String(type),
    description: String(description),
    price,
    stock,
    unit: String(unit),
    storeId: Number(raw.storeId ?? raw.tiendaId ?? 0),
    storeName: raw.storeName || raw.tienda || undefined,
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.updated_at || undefined,
  } as StoreInput;
}

export const storeService = new StoreService();
