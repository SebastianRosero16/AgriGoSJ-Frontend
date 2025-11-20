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
  async getInputs(options?: { public?: boolean; storeId?: number }): Promise<StoreInput[]> {
    // Choose the correct endpoint according to backend public endpoints
    let url: string;
    if (options?.public) {
      url = API_ENDPOINTS.STORE.INPUTS_PUBLIC;
    } else if (options?.storeId) {
      url = API_ENDPOINTS.STORE.INPUTS_BY_STORE(options.storeId);
    } else {
      url = API_ENDPOINTS.STORE.INPUTS;
    }

    // Normalizar respuesta para manejar distintos formatos que pueda devolver el backend
    const data: any = await httpClient.get(url);

    // Log raw response for debugging when running locally/deployed
    try {
      // Use console.debug to avoid noisy logs in production but keep info for troubleshooting
      console.debug('[storeService] getInputs raw response:', data);
    } catch (e) {
      // ignore
    }

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
   * Get public inputs (new backend endpoint)
   */
  async getInputsPublic(): Promise<StoreInput[]> {
    const data: any = await httpClient.get(API_ENDPOINTS.STORE.INPUTS_PUBLIC);
    try { console.debug('[storeService] getInputsPublic raw response:', data); } catch {}
    if (!data) return [];
    if (Array.isArray(data)) return data.map(normalizeInput) as StoreInput[];
    if (Array.isArray(data.data)) return data.data.map(normalizeInput) as StoreInput[];
    if (Array.isArray(data.items)) return data.items.map(normalizeInput) as StoreInput[];
    if (Array.isArray(data.inputs)) return data.inputs.map(normalizeInput) as StoreInput[];
    if (typeof data === 'object') return [normalizeInput(data as any) as StoreInput];
    return [];
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

  const getString = (...candidates: any[]) => {
    for (const c of candidates) {
      if (c === undefined || c === null) continue;
      if (typeof c === 'string' && c.trim() !== '') return c.trim();
      if (typeof c === 'number') return String(c);
    }
    return '';
  };

  const parseNumber = (val: any) => {
    if (val === undefined || val === null || val === '') return 0;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      // Remove currency symbols and spaces, handle thousand separators and comma decimals
      const cleaned = val.replace(/[₹$€¥£\s]/g, '').replace(/\.(?=\d{3,})/g, '').replace(/,/g, '.');
      const n = Number(cleaned.replace(/[^0-9.\-]/g, ''));
      return Number.isFinite(n) ? n : 0;
    }
    // Try nested shapes
    if (typeof val === 'object') {
      return parseNumber(val.price ?? val.amount ?? val.value ?? val.unitPrice ?? 0);
    }
    return 0;
  };

  const name = getString(raw.name, raw.inputName, raw.productName, raw.title, raw.nombre, raw.label);
  const type = getString(raw.type, raw.inputType, raw.category, raw.typeName, raw.tipo);
  const description = getString(raw.description, raw.descripcion, raw.desc, raw.summary);

  const rawPrice = parseNumber(raw.price ?? raw.unitPrice ?? raw.valor ?? raw.cost ?? raw.amount ?? raw.pricing ?? raw.priceInfo);
  const price = Number.isFinite(rawPrice) ? Math.round(rawPrice) : 0;

  const rawStock = parseNumber(raw.stock ?? raw.quantity ?? raw.cantidad ?? raw.available ?? raw.stockLevel ?? raw.inventory);
  const stock = Math.max(0, Math.floor(Number.isFinite(rawStock) ? rawStock : 0));

  const unit = getString(raw.unit, raw.unidad, raw.measureUnit, raw.uom) || 'unidad';

  const storeId = Number(raw.storeId ?? raw.tiendaId ?? raw.vendorId ?? raw.sellerId ?? raw.seller?.id ?? raw.store?.id ?? 0) || 0;
  const storeName = getString(raw.storeName, raw.tienda, raw.sellerName, raw.vendorName, raw.farmerName, raw.store?.name, raw.seller?.name) || undefined;

  const createdAt = getString(raw.createdAt, raw.created_at, raw.timestamp, raw.created) || new Date().toISOString();
  const updatedAt = getString(raw.updatedAt, raw.updated_at, raw.modifiedAt, raw.modified) || undefined;

  return {
    id: Number(raw.id ?? raw.inputId ?? raw._id ?? raw.productId ?? 0),
    name: String(name),
    type: String(type),
    description: String(description),
    price,
    stock,
    unit: String(unit),
    storeId,
    storeName,
    createdAt,
    updatedAt,
  } as StoreInput;
}

export const storeService = new StoreService();
