import { apiClient } from '../../../services/apiClient';
import type { AuthResponse, User } from '../types';

export const authService = {
  async register(data: any): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  async login(data: any): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/api/auth/me');
    return response.data;
  },

  async updateProfile(data: any): Promise<User> {
    const response = await apiClient.put<User>('/api/users/me', data);
    return response.data;
  },

  async updatePassword(data: any): Promise<void> {
    await apiClient.put('/api/users/me/password', data);
  }
};
