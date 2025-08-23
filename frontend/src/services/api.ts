import axios from 'axios';
import { Transaction, Position, Trade } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Positions
  getPositions: async (): Promise<Position[]> => {
    const response = await api.get('/positions');
    return response.data;
  },

  // Trades
  getTrades: async (): Promise<Trade[]> => {
    const response = await api.get('/trades');
    return response.data;
  },

  // Transactions
  addTransaction: async (transaction: Omit<Transaction, 'transactionId'>): Promise<{ transaction: Transaction; positions: Position[] }> => {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },

  addBulkTransactions: async (transactions: Omit<Transaction, 'transactionId'>[]): Promise<{ positions: Position[] }> => {
    const response = await api.post('/transactions/bulk', transactions);
    return response.data;
  },

  // Data management
  resetData: async (): Promise<void> => {
    await api.post('/reset');
  },

  loadSampleData: async (): Promise<{ positions: Position[] }> => {
    const response = await api.post('/load-sample');
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};
