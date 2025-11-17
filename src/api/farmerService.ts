/**
 * Farmer API Service
 * Handles crops and farmer-specific operations
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Crop, CreateCropRequest, UpdateCropRequest } from '@/types';

/**
 * Farmer Service Class
 */
class FarmerService {
  /**
   * Get all crops for current farmer
   */
  async getCrops(): Promise<Crop[]> {
    return await httpClient.get<Crop[]>(API_ENDPOINTS.FARMER.CROPS);
  }

  /**
   * Get crop by ID
   */
  async getCropById(id: number): Promise<Crop> {
    return await httpClient.get<Crop>(API_ENDPOINTS.FARMER.CROP_BY_ID(id));
  }

  /**
   * Create new crop
   */
  async createCrop(crop: CreateCropRequest): Promise<Crop> {
    return await httpClient.post<Crop>(API_ENDPOINTS.FARMER.CROPS, crop);
  }

  /**
   * Update existing crop
   */
  async updateCrop(id: number, crop: UpdateCropRequest): Promise<Crop> {
    return await httpClient.put<Crop>(API_ENDPOINTS.FARMER.CROP_BY_ID(id), crop);
  }

  /**
   * Delete crop
   */
  async deleteCrop(id: number): Promise<void> {
    return await httpClient.delete(API_ENDPOINTS.FARMER.CROP_BY_ID(id));
  }
}

export const farmerService = new FarmerService();
