/**
 * Marketplace API Service
 * Handles product listing and management
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Product, CreateProductRequest, UpdateProductRequest } from '@/types';

/**
 * Marketplace Service Class
 */
class MarketplaceService {
  /**
   * Get all products (public)
   */
  async getProducts(): Promise<Product[]> {
    return await httpClient.get<Product[]>(API_ENDPOINTS.MARKETPLACE.PRODUCTS);
  }

  /**
   * Get farmer's own products
   */
  async getMyProducts(): Promise<Product[]> {
    try {
      // Intentar primero con el endpoint de farmer
      const response = await httpClient.get<Product[]>(API_ENDPOINTS.FARMER.PRODUCTS);
      return response || [];
    } catch (error: any) {
      // Si el endpoint no existe, intentar con marketplace y filtrar por usuario
      if (error?.status === 404 || error?.status === 500) {
        try {
          const allProducts = await httpClient.get<Product[]>(API_ENDPOINTS.MARKETPLACE.PRODUCTS);
          return allProducts || [];
        } catch {
          return [];
        }
      }
      throw error;
    }
  }

  /**
   * Get product by ID (public)
   */
  async getProductById(id: number): Promise<Product> {
    return await httpClient.get<Product>(API_ENDPOINTS.MARKETPLACE.PRODUCT_BY_ID(id));
  }

  /**
   * Create new product (FARMER only)
   */
  async createProduct(product: CreateProductRequest): Promise<Product> {
    try {
      return await httpClient.post<Product>(API_ENDPOINTS.FARMER.PRODUCTS, product);
    } catch (error: any) {
      // Si el endpoint de farmer no existe, usar marketplace
      if (error?.status === 404 || error?.status === 500) {
        return await httpClient.post<Product>(API_ENDPOINTS.MARKETPLACE.PRODUCTS, product);
      }
      throw error;
    }
  }

  /**
   * Update existing product (FARMER only)
   */
  async updateProduct(id: number, product: UpdateProductRequest): Promise<Product> {
    try {
      return await httpClient.put<Product>(API_ENDPOINTS.FARMER.PRODUCT_BY_ID(id), product);
    } catch (error: any) {
      // Si el endpoint de farmer no existe, usar marketplace
      if (error?.status === 404 || error?.status === 500) {
        return await httpClient.put<Product>(API_ENDPOINTS.MARKETPLACE.PRODUCT_BY_ID(id), product);
      }
      throw error;
    }
  }

  /**
   * Delete product (FARMER only)
   */
  async deleteProduct(id: number): Promise<void> {
    try {
      return await httpClient.delete(API_ENDPOINTS.FARMER.PRODUCT_BY_ID(id));
    } catch (error: any) {
      // Si el endpoint de farmer no existe, usar marketplace
      if (error?.status === 404 || error?.status === 500) {
        return await httpClient.delete(API_ENDPOINTS.MARKETPLACE.PRODUCT_BY_ID(id));
      }
      throw error;
    }
  }

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<Product[]> {
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
  async filterByCategory(category: string): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(product => product.category === category);
  }

  /**
   * Filter products by price range
   */
  async filterByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
  }
}

export const marketplaceService = new MarketplaceService();
