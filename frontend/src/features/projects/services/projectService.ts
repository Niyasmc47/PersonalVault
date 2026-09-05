import { apiClient } from '../../../../services/apiClient';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../types';

export const projectService = {
  getAllProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get('/api/projects');
    return response.data;
  },

  getProjectById: async (id: number): Promise<Project> => {
    const response = await apiClient.get(`/api/projects/${id}`);
    return response.data;
  },

  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post('/api/projects', data);
    return response.data;
  },

  updateProject: async (id: number, data: UpdateProjectRequest): Promise<Project> => {
    const response = await apiClient.put(`/api/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/projects/${id}`);
  }
};
