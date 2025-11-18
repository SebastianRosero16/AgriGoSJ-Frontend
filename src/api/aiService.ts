/**
 * AI API Service
 * Handles AI recommendations and explanations
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { AIRecommendation, AIRecommendationRequest } from '@/types';
import { Queue } from '@/data-structures';
import { QUEUE_CONFIG } from '@/utils/constants';

/**
 * AI Request Queue Manager
 * Prevents spam and manages AI request rate limiting
 */
class AIRequestQueue {
  private requestQueue: Queue<() => Promise<any>>;
  private isProcessing: boolean = false;
  private lastRequestTime: number = 0;

  constructor() {
    this.requestQueue = new Queue<() => Promise<any>>();
  }

  /**
   * Enqueue AI request with cooldown
   */
  async enqueue<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.enqueue(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  /**
   * Process queue with rate limiting
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.isEmpty()) {
      return;
    }

    this.isProcessing = true;

    while (!this.requestQueue.isEmpty()) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      // Enforce cooldown period
      if (timeSinceLastRequest < QUEUE_CONFIG.AI_REQUEST_COOLDOWN) {
        await this.sleep(QUEUE_CONFIG.AI_REQUEST_COOLDOWN - timeSinceLastRequest);
      }

      const request = this.requestQueue.dequeue();
      if (request) {
        this.lastRequestTime = Date.now();
        await request();
      }
    }

    this.isProcessing = false;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * AI Service Class
 */
class AIService {
  private requestQueue: AIRequestQueue;

  constructor() {
    this.requestQueue = new AIRequestQueue();
  }

  /**
   * Request AI recommendation (with queue)
   */
  async requestRecommendation(request: AIRecommendationRequest): Promise<AIRecommendation> {
    return this.requestQueue.enqueue(async () => {
      return await httpClient.post<AIRecommendation>(
        API_ENDPOINTS.AI.RECOMMEND,
        request
      );
    });
  }

  /**
   * Get AI recommendation
   */
  async getRecommendation(params: { type: string; cropId: number; context?: any }): Promise<any> {
    return this.requestQueue.enqueue(async () => {
      return await httpClient.post<any>(
        API_ENDPOINTS.AI.RECOMMEND,
        params
      );
    });
  }

  /**
   * Get explanation for crop
   */
  async getExplanation(cropId: number): Promise<string> {
    return await httpClient.get<string>(API_ENDPOINTS.AI.EXPLAIN(cropId));
  }

  /**
   * Get recommendation history for crop
   */
  async getRecommendations(cropId: number): Promise<AIRecommendation[]> {
    return await httpClient.get<AIRecommendation[]>(API_ENDPOINTS.AI.RECOMMENDATIONS(cropId));
  }
}

export const aiService = new AIService();
