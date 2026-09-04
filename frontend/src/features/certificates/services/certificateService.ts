import { apiClient } from '../../../services/apiClient';
import type {
  Certificate,
  CertificateFilterParams,
  CertificateSummary,
  CreateCertificatePayload,
  GoogleDriveStatus,
  UpdateCertificatePayload,
} from '../types';

export const certificateService = {
  // Certificates CRUD
  getCertificates: async (params?: CertificateFilterParams): Promise<Certificate[]> => {
    const response = await apiClient.get<Certificate[]>('/api/certificates', { params });
    return response.data;
  },

  getCertificateById: async (id: number): Promise<Certificate> => {
    const response = await apiClient.get<Certificate>(`/api/certificates/${id}`);
    return response.data;
  },

  uploadCertificate: async (payload: CreateCertificatePayload): Promise<Certificate> => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('issuer', payload.issuer);
    if (payload.description) formData.append('description', payload.description);
    formData.append('category', payload.category);
    formData.append('issueDate', payload.issueDate);
    if (payload.expiryDate) formData.append('expiryDate', payload.expiryDate);
    if (payload.credentialId) formData.append('credentialId', payload.credentialId);
    if (payload.credentialUrl) formData.append('credentialUrl', payload.credentialUrl);
    formData.append('file', payload.file);

    const response = await apiClient.post<Certificate>('/api/certificates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCertificate: async (id: number, payload: UpdateCertificatePayload): Promise<Certificate> => {
    const response = await apiClient.put<Certificate>(`/api/certificates/${id}`, payload);
    return response.data;
  },

  deleteCertificate: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/certificates/${id}`);
  },

  getCertificateSummary: async (): Promise<CertificateSummary> => {
    const response = await apiClient.get<CertificateSummary>('/api/certificates/summary');
    return response.data;
  },

  // Google Drive Integration
  getDriveStatus: async (): Promise<GoogleDriveStatus> => {
    const response = await apiClient.get<GoogleDriveStatus>('/api/integrations/google-drive/status');
    return response.data;
  },

  getDriveAuthUrl: async (): Promise<{ authUrl: string }> => {
    const response = await apiClient.get<{ authUrl: string }>('/api/integrations/google-drive/auth-url');
    return response.data;
  },

  disconnectDrive: async (): Promise<void> => {
    await apiClient.post('/api/integrations/google-drive/disconnect');
  },

  // File Preview & Download
  getCertificateBlob: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/api/certificates/${id}/preview`, {
      responseType: 'blob',
    });
    return response.data;
  },

  downloadCertificate: async (id: number, fallbackFileName = 'certificate.pdf'): Promise<void> => {
    const response = await apiClient.get(`/api/certificates/${id}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fallbackFileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
