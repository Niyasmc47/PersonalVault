import { apiClient } from '../../../services/apiClient';
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectFilterParams,
} from '../types';

export const projectService = {
  getProjects: async (params?: ProjectFilterParams): Promise<Project[]> => {
    const queryParams: Record<string, string | boolean> = {};

    if (params?.category) {
      queryParams.category = params.category;
    }
    if (params?.status) {
      queryParams.status = params.status;
    }
    if (typeof params?.featured === 'boolean') {
      queryParams.featured = params.featured;
    }
    if (params?.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }

    const response = await apiClient.get('/api/projects', {
      params: queryParams,
    });
    return response.data;
  },

  getProjectById: async (id: number): Promise<Project> => {
    const response = await apiClient.get(`/api/projects/${id}`);
    return response.data;
  },

  createProject: async (data: CreateProjectPayload): Promise<Project> => {
    const response = await apiClient.post('/api/projects', data);
    return response.data;
  },

  updateProject: async (id: number, data: UpdateProjectPayload): Promise<Project> => {
    const response = await apiClient.put(`/api/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/projects/${id}`);
  },
};
