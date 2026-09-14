import { apiClient } from '../../../services/apiClient';
import type {
  Skill,
  CreateSkillPayload,
  UpdateSkillPayload,
  SkillFilterParams,
} from '../types';

export const skillService = {
  async getSkills(params?: SkillFilterParams): Promise<Skill[]> {
    const queryParams: Record<string, string | boolean> = {};

    if (params?.category) queryParams.category = params.category;
    if (params?.proficiency) queryParams.proficiency = params.proficiency;
    if (params?.featured !== undefined) queryParams.featured = params.featured;
    if (params?.includeInResume !== undefined) queryParams.includeInResume = params.includeInResume;
    if (params?.search && params.search.trim() !== '') queryParams.search = params.search.trim();

    const response = await apiClient.get<Skill[]>('/api/skills', {
      params: queryParams,
    });
    return response.data;
  },

  async getSkillById(id: number): Promise<Skill> {
    const response = await apiClient.get<Skill>(`/api/skills/${id}`);
    return response.data;
  },

  async createSkill(payload: CreateSkillPayload): Promise<Skill> {
    const response = await apiClient.post<Skill>('/api/skills', payload);
    return response.data;
  },

  async updateSkill(id: number, payload: UpdateSkillPayload): Promise<Skill> {
    const response = await apiClient.put<Skill>(`/api/skills/${id}`, payload);
    return response.data;
  },

  async deleteSkill(id: number): Promise<void> {
    await apiClient.delete(`/api/skills/${id}`);
  },

  async reorderSkills(skillIds: number[]): Promise<Skill[]> {
    const response = await apiClient.put<Skill[]>('/api/skills/reorder', {
      skillIds,
    });
    return response.data;
  },
};

