/**
 * Price Comparator API Service
 * Handles price comparison operations
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { PriceComparison } from '@/types';
import { PriceComparisonGraph } from '@/data-structures/Graph';

/**
 * Price Comparator Service Class
 */
class PriceComparatorService {
  private priceGraph: PriceComparisonGraph;

  constructor() {
    this.priceGraph = new PriceComparisonGraph();
  }

  /**
   * Compare prices for specific input
   */
  async comparePrices(inputId: number): Promise<PriceComparison> {
    return await httpClient.get<PriceComparison>(API_ENDPOINTS.PRICE_COMPARATOR.COMPARE(inputId));
  }

  /**
   * Get all price comparisons
   */
  async getAllComparisons(): Promise<PriceComparison[]> {
    return await httpClient.get<PriceComparison[]>(API_ENDPOINTS.PRICE_COMPARATOR.ALL);
  }

  /**
   * Build price comparison graph
   */
  buildPriceGraph(comparisons: PriceComparison[]): PriceComparisonGraph {
    const graph = new PriceComparisonGraph();

    comparisons.forEach(comparison => {
      comparison.prices.forEach(priceInfo => {
        graph.addStore({
          storeId: String(priceInfo.storeId),
          storeName: priceInfo.storeName,
          inputId: String(comparison.inputId),
          price: priceInfo.price,
        });
      });

      // Connect stores selling same input
      graph.connectStoresBySameInput(String(comparison.inputId));
    });

    return graph;
  }

  /**
   * Find best prices using graph
   */
  findBestPrices(inputId: number, limit: number = 5) {
    return this.priceGraph.findBestPrices(String(inputId), limit);
  }

  /**
   * Get price statistics
   */
  getPriceStatistics(comparison: PriceComparison) {
    return {
      min: comparison.minPrice,
      max: comparison.maxPrice,
      avg: comparison.avgPrice,
      range: comparison.maxPrice - comparison.minPrice,
      savings: comparison.maxPrice - comparison.minPrice,
      savingsPercent: ((comparison.maxPrice - comparison.minPrice) / comparison.maxPrice) * 100,
    };
  }
}

export const priceComparatorService = new PriceComparatorService();
