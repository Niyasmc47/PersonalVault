import { apiClient } from '../../../services/apiClient';
import type {
  Achievement,
  CreateAchievementPayload,
  UpdateAchievementPayload,
  AchievementFilterParams,
} from '../types';

export const achievementService = {
  async getAchievements(params?: AchievementFilterParams): Promise<Achievement[]> {
    const queryParams: Record<string, string | boolean> = {};

    if (params?.category) queryParams.category = params.category;
    if (params?.featured !== undefined) queryParams.featured = params.featured;
    if (params?.includeInResume !== undefined) queryParams.includeInResume = params.includeInResume;
    if (params?.search && params.search.trim() !== '') queryParams.search = params.search.trim();

    const response = await apiClient.get<Achievement[]>('/api/achievements', {
      params: queryParams,
    });
    return response.data;
  },

  async getAchievementById(id: number): Promise<Achievement> {
    const response = await apiClient.get<Achievement>(`/api/achievements/${id}`);
    return response.data;
  },

  async createAchievement(payload: CreateAchievementPayload): Promise<Achievement> {
    const response = await apiClient.post<Achievement>('/api/achievements', payload);
    return response.data;
  },

  async updateAchievement(id: number, payload: UpdateAchievementPayload): Promise<Achievement> {
    const response = await apiClient.put<Achievement>(`/api/achievements/${id}`, payload);
    return response.data;
  },

  async deleteAchievement(id: number): Promise<void> {
    await apiClient.delete(`/api/achievements/${id}`);
  },

  async reorderAchievements(achievementIds: number[]): Promise<Achievement[]> {
    const response = await apiClient.put<Achievement[]>('/api/achievements/reorder', {
      achievementIds,
    });
    return response.data;
  },
};

