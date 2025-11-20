/**
 * Payment Service
 * Client for initiating and checking payments (Stripe, Nequi) as described.
 */

import { httpClient } from './httpClient';

class PaymentService {
  async initiatePayment(payload: any): Promise<any> {
    return await httpClient.post('/payments', payload);
  }

  async confirmPayment(transactionId: string): Promise<any> {
    return await httpClient.post(`/payments/confirm/${transactionId}`);
  }

  async getTransaction(transactionId: string): Promise<any> {
    return await httpClient.get(`/payments/transaction/${transactionId}`);
  }

  async getByOrder(orderNumber: string): Promise<any> {
    return await httpClient.get(`/payments/order/${orderNumber}`);
  }
}

export const paymentService = new PaymentService();
