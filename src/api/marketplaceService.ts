/**
 * Marketplace API Service
 * Handles product listing and management
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { FarmerProduct, CreateProductRequest, UpdateProductRequest } from '@/types';

/**
 * Marketplace Service Class
 */
class MarketplaceService {
  /**
   * Get all products (public)
   */
  async getProducts(): Promise<FarmerProduct[]> {
    return await httpClient.get<FarmerProduct[]>(API_ENDPOINTS.MARKETPLACE.PRODUCTS);
  }

  /**
   * Get product by ID (public)
   */
  async getProductById(id: number): Promise<FarmerProduct> {
    return await httpClient.get<FarmerProduct>(API_ENDPOINTS.MARKETPLACE.PRODUCT_BY_ID(id));
  }

  /**
   * Create new product (FARMER only)
   */
  async createProduct(product: CreateProductRequest): Promise<FarmerProduct> {
    return await httpClient.post<FarmerProduct>(API_ENDPOINTS.MARKETPLACE.PRODUCTS, product);
  }

  /**
   * Update existing product (FARMER only)
   */
  async updateProduct(id: number, product: UpdateProductRequest): Promise<FarmerProduct> {
    return await httpClient.put<FarmerProduct>(API_ENDPOINTS.MARKETPLACE.PRODUCT_BY_ID(id), product);
  }

  /**
   * Delete product (FARMER only)
   */
  async deleteProduct(id: number): Promise<void> {
    return await httpClient.delete(API_ENDPOINTS.MARKETPLACE.PRODUCT_BY_ID(id));
  }

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<FarmerProduct[]> {
    const products = await this.getProducts();
    const lowerQuery = query.toLowerCase();
    
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter products by category
   */
  async filterByCategory(category: string): Promise<FarmerProduct[]> {
    const products = await this.getProducts();
    return products.filter(product => product.category === category);
  }

  /**
   * Filter products by price range
   */
  async filterByPriceRange(minPrice: number, maxPrice: number): Promise<FarmerProduct[]> {
    const products = await this.getProducts();
    return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
  }
}

export const marketplaceService = new MarketplaceService();
