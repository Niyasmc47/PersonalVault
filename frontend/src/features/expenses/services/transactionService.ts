import { apiClient } from '../../../services/apiClient';
import type { 
  Transaction, 
  CreateTransactionRequest, 
  UpdateTransactionRequest, 
  TransactionSummary, 
  CategorySummary,
  TransactionFilters
} from '../types';

export const transactionService = {
  getTransactions: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await apiClient.get<Transaction[]>('/api/transactions', { params });
    return response.data;
  },

  getTransactionById: async (id: number): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(`/api/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/api/transactions', data);
    return response.data;
  },

  updateTransaction: async (id: number, data: UpdateTransactionRequest): Promise<Transaction> => {
    const response = await apiClient.put<Transaction>(`/api/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/transactions/${id}`);
  },

  getSummary: async (): Promise<TransactionSummary> => {
    const response = await apiClient.get<TransactionSummary>('/api/transactions/summary');
    return response.data;
  },

  getCategorySummary: async (type?: 'INCOME' | 'EXPENSE'): Promise<CategorySummary[]> => {
    const params = type ? { type } : undefined;
    const response = await apiClient.get<CategorySummary[]>('/api/transactions/category-summary', { params });
    return response.data;
  }
};
