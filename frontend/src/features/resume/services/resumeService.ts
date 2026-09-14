import { apiClient } from '../../../services/apiClient';
import type {
  Resume,
  ResumeSummary,
  ResumeContent,
  CreateResumePayload,
  UpdateResumePayload,
} from '../types';

export const resumeService = {
  async getResumes(): Promise<ResumeSummary[]> {
    const response = await apiClient.get<ResumeSummary[]>('/api/resumes');
    return response.data;
  },

  async getResumeById(id: number): Promise<Resume> {
    const response = await apiClient.get<Resume>(`/api/resumes/${id}`);
    return response.data;
  },

  async createResume(payload: CreateResumePayload): Promise<Resume> {
    const response = await apiClient.post<Resume>('/api/resumes', payload);
    return response.data;
  },

  async updateResume(id: number, payload: UpdateResumePayload): Promise<Resume> {
    const response = await apiClient.put<Resume>(`/api/resumes/${id}`, payload);
    return response.data;
  },

  async deleteResume(id: number): Promise<void> {
    await apiClient.delete(`/api/resumes/${id}`);
  },

  async getAutoBuildPreview(): Promise<ResumeContent> {
    const response = await apiClient.get<ResumeContent>('/api/resumes/auto-build-preview');
    return response.data;
  },

  async rebuildResume(id: number): Promise<Resume> {
    const response = await apiClient.post<Resume>(`/api/resumes/${id}/auto-build`);
    return response.data;
  },
};

