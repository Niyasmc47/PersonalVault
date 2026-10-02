import { apiClient } from './apiClient';
import type {
  SmartDropAnalysisItem,
  SmartDropConfirmPayload,
  SmartDropConfirmResult,
  SmartDropBatchConfirmResult,
} from '../types/smartdrop';

export const smartdropService = {
  async analyzeFiles(files: File[]): Promise<SmartDropAnalysisItem[]> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    const response = await apiClient.post<SmartDropAnalysisItem[]>('/api/smartdrop/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPreviewUrl(tempFileId: string): string {
    const baseURL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8080';
    return `${baseURL}/api/smartdrop/preview/${encodeURIComponent(tempFileId)}`;
  },

  async confirmItem(payload: SmartDropConfirmPayload, vaultToken?: string | null): Promise<SmartDropConfirmResult> {
    const headers: Record<string, string> = {};
    if (vaultToken) {
      headers['X-Vault-Token'] = vaultToken;
    }

    const response = await apiClient.post<SmartDropConfirmResult>('/api/smartdrop/confirm', payload, {
      headers,
    });
    return response.data;
  },

  async confirmBatch(
    confirmations: SmartDropConfirmPayload[],
    vaultToken?: string | null
  ): Promise<SmartDropBatchConfirmResult> {
    const headers: Record<string, string> = {};
    if (vaultToken) {
      headers['X-Vault-Token'] = vaultToken;
    }

    const response = await apiClient.post<SmartDropBatchConfirmResult>(
      '/api/smartdrop/confirm-batch',
      { confirmations },
      { headers }
    );
    return response.data;
  },

  async discardTempFile(tempFileId: string): Promise<void> {
    await apiClient.delete(`/api/smartdrop/${encodeURIComponent(tempFileId)}`);
  },
};
