import { apiClient } from '../../../services/apiClient';
import type {
  SocialLink,
  CreateSocialLinkPayload,
  UpdateSocialLinkPayload,
} from '../types';

export const socialService = {
  async getSocialLinks(includeInResume?: boolean): Promise<SocialLink[]> {
    const params: Record<string, boolean> = {};
    if (includeInResume !== undefined) params.includeInResume = includeInResume;

    const response = await apiClient.get<SocialLink[]>('/api/social-links', {
      params,
    });
    return response.data;
  },

  async getSocialLinkById(id: number): Promise<SocialLink> {
    const response = await apiClient.get<SocialLink>(`/api/social-links/${id}`);
    return response.data;
  },

  async createSocialLink(payload: CreateSocialLinkPayload): Promise<SocialLink> {
    const response = await apiClient.post<SocialLink>('/api/social-links', payload);
    return response.data;
  },

  async updateSocialLink(id: number, payload: UpdateSocialLinkPayload): Promise<SocialLink> {
    const response = await apiClient.put<SocialLink>(`/api/social-links/${id}`, payload);
    return response.data;
  },

  async deleteSocialLink(id: number): Promise<void> {
    await apiClient.delete(`/api/social-links/${id}`);
  },

  async reorderSocialLinks(socialLinkIds: number[]): Promise<SocialLink[]> {
    const response = await apiClient.put<SocialLink[]>('/api/social-links/reorder', {
      socialLinkIds,
    });
    return response.data;
  },
};

