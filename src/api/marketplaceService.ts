/**
 * Marketplace API Service
 * Handles product listing and management
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Product, CreateProductRequest, UpdateProductRequest } from '@/types';

/**
 * Mapea la respuesta del backend al formato del frontend
 * Backend usa: productName, productCategory, productDescription, quantity
 * Frontend usa: name, category, description, stock
 */
const mapBackendProductToFrontend = (backendProduct: any): Product => {
  return {
    id: backendProduct.id,
    name: backendProduct.productName || backendProduct.name,
    description: backendProduct.productDescription || backendProduct.description || '',
    price: backendProduct.price,
    stock: backendProduct.quantity ?? backendProduct.stock ?? 0,
    unit: backendProduct.unit,
    category: backendProduct.productCategory || backendProduct.category,
    imageUrl: backendProduct.imageUrl,
    farmerId: backendProduct.farmerId,
    farmerName: backendProduct.farmerName,
    createdAt: backendProduct.createdAt,
    updatedAt: backendProduct.updatedAt,
  };
};

/**
 * Marketplace Service Class
 */
class MarketplaceService {
  /**
   * Get all products (public)
   */
  async getProducts(): Promise<Product[]> {
    const backendProducts = await httpClient.get<any[]>(API_ENDPOINTS.MARKETPLACE.PRODUCTS);
    return backendProducts.map(mapBackendProductToFrontend);
  }

  /**
   * Get farmer's own products
   */
  async getMyProducts(): Promise<Product[]> {
    const backendProducts = await httpClient.get<any[]>(API_ENDPOINTS.FARMER.PRODUCTS);
    return backendProducts.map(mapBackendProductToFrontend);
  }

  /**
   * Get product by ID (public)
   */
  async getProductById(id: number): Promise<Product> {
    const backendProduct = await httpClient.get<any>(API_ENDPOINTS.MARKETPLACE.PRODUCT_BY_ID(id));
    return mapBackendProductToFrontend(backendProduct);
  }

  /**
   * Create new product (FARMER only)
   */
  async createProduct(product: CreateProductRequest): Promise<Product> {
    const backendProduct = await httpClient.post<any>(API_ENDPOINTS.FARMER.PRODUCTS, product);
    return mapBackendProductToFrontend(backendProduct);
  }

  /**
   * Update existing product (FARMER only)
   */
  async updateProduct(id: number, product: UpdateProductRequest): Promise<Product> {
    const backendProduct = await httpClient.put<any>(API_ENDPOINTS.FARMER.PRODUCT_BY_ID(id), product);
    return mapBackendProductToFrontend(backendProduct);
  }

  /**
   * Delete product (FARMER only)
   */
  async deleteProduct(id: number): Promise<void> {
    return await httpClient.delete(API_ENDPOINTS.FARMER.PRODUCT_BY_ID(id));
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
