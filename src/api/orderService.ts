/**
 * Order Service
 * Basic client for order endpoints described by backend.
 */

import { httpClient } from './httpClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Order, CreateOrderRequest } from '@/types';

class OrderService {
  async createOrder(payload: CreateOrderRequest): Promise<Order> {
    return await httpClient.post<Order>('/orders', payload);
  }

  async getMyOrders(): Promise<Order[]> {
    return await httpClient.get<Order[]>(`/orders/my-orders`);
  }

  async getOrder(orderNumber: string): Promise<Order> {
    return await httpClient.get<Order>(`/orders/${orderNumber}`);
  }

  async cancelOrder(orderNumber: string): Promise<void> {
    return await httpClient.delete(`/orders/${orderNumber}`);
  }
}

export const orderService = new OrderService();
