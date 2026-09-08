import { apiClient } from '../../../services/apiClient';
import type {
  CredentialCategory,
  CredentialItem,
  CredentialPayload,
  CredentialReveal,
  FinancialAccountItem,
  FinancialAccountPayload,
  FinancialAccountReveal,
  FinancialAccountType,
  IdentityDocumentItem,
  IdentityDocumentPayload,
  IdentityDocumentReveal,
  IdentityDocumentType,
  VaultDocumentCategory,
  VaultDocumentItem,
  VaultDocumentPayload,
  VaultDocumentReveal,
  VaultDocumentSection,
  VaultStatus,
  VaultUnlockResponse,
} from '../types';

export const vaultService = {
  // ── Vault Status & Lock Management ──────────────────────────────
  async getStatus(vaultToken?: string | null): Promise<VaultStatus> {
    const headers: Record<string, string> = {};
    if (vaultToken) {
      headers['X-Vault-Token'] = vaultToken;
    }
    const res = await apiClient.get<VaultStatus>('/api/vault/status', { headers });
    return res.data;
  },

  async setup(masterPassword: string, confirmPassword: string, passwordHint?: string): Promise<VaultUnlockResponse> {
    const res = await apiClient.post<VaultUnlockResponse>('/api/vault/setup', {
      masterPassword,
      confirmPassword,
      passwordHint,
    });
    return res.data;
  },

  async unlock(masterPassword: string): Promise<VaultUnlockResponse> {
    const res = await apiClient.post<VaultUnlockResponse>('/api/vault/unlock', {
      masterPassword,
    });
    return res.data;
  },

  async lock(): Promise<void> {
    await apiClient.post('/api/vault/lock');
  },

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string, passwordHint?: string): Promise<void> {
    await apiClient.post('/api/vault/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
      passwordHint,
    });
  },

  // ── Credentials ───────────────────────────────────────────────
  async getCredentials(category?: CredentialCategory, search?: string): Promise<CredentialItem[]> {
    const params: Record<string, string> = {};
    if (category) params.category = category;
    if (search) params.search = search;
    const res = await apiClient.get<CredentialItem[]>('/api/vault/credentials', { params });
    return res.data;
  },

  async createCredential(payload: CredentialPayload): Promise<CredentialItem> {
    const res = await apiClient.post<CredentialItem>('/api/vault/credentials', payload);
    return res.data;
  },

  async updateCredential(id: number, payload: CredentialPayload): Promise<CredentialItem> {
    const res = await apiClient.put<CredentialItem>(`/api/vault/credentials/${id}`, payload);
    return res.data;
  },

  async deleteCredential(id: number): Promise<void> {
    await apiClient.delete(`/api/vault/credentials/${id}`);
  },

  async revealCredential(id: number, vaultToken: string): Promise<CredentialReveal> {
    const res = await apiClient.post<CredentialReveal>(
      `/api/vault/credentials/${id}/reveal`,
      {},
      { headers: { 'X-Vault-Token': vaultToken } }
    );
    return res.data;
  },

  // ── Identity Documents ─────────────────────────────────────────
  async getIdentityDocuments(type?: IdentityDocumentType, search?: string): Promise<IdentityDocumentItem[]> {
    const params: Record<string, string> = {};
    if (type) params.type = type;
    if (search) params.search = search;
    const res = await apiClient.get<IdentityDocumentItem[]>('/api/vault/identity-documents', { params });
    return res.data;
  },

  async createIdentityDocument(payload: IdentityDocumentPayload): Promise<IdentityDocumentItem> {
    const formData = new FormData();
    formData.append('type', payload.type);
    formData.append('holderName', payload.holderName);
    if (payload.documentNumber) formData.append('documentNumber', payload.documentNumber);
    if (payload.issueDate) formData.append('issueDate', payload.issueDate);
    if (payload.expiryDate) formData.append('expiryDate', payload.expiryDate);
    if (payload.notes) formData.append('notes', payload.notes);
    if (payload.frontFile) formData.append('frontFile', payload.frontFile);
    if (payload.backFile) formData.append('backFile', payload.backFile);

    const res = await apiClient.post<IdentityDocumentItem>('/api/vault/identity-documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async updateIdentityDocument(id: number, payload: IdentityDocumentPayload): Promise<IdentityDocumentItem> {
    const formData = new FormData();
    formData.append('type', payload.type);
    formData.append('holderName', payload.holderName);
    if (payload.documentNumber) formData.append('documentNumber', payload.documentNumber);
    if (payload.issueDate) formData.append('issueDate', payload.issueDate);
    if (payload.expiryDate) formData.append('expiryDate', payload.expiryDate);
    if (payload.notes) formData.append('notes', payload.notes);
    if (payload.frontFile) formData.append('frontFile', payload.frontFile);
    if (payload.backFile) formData.append('backFile', payload.backFile);

    const res = await apiClient.put<IdentityDocumentItem>(`/api/vault/identity-documents/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async deleteIdentityDocument(id: number): Promise<void> {
    await apiClient.delete(`/api/vault/identity-documents/${id}`);
  },

  async revealIdentityDocument(id: number, vaultToken: string): Promise<IdentityDocumentReveal> {
    const res = await apiClient.post<IdentityDocumentReveal>(
      `/api/vault/identity-documents/${id}/reveal`,
      {},
      { headers: { 'X-Vault-Token': vaultToken } }
    );
    return res.data;
  },

  async getIdentityDocumentBlob(id: number, side: 'front' | 'back', vaultToken: string): Promise<Blob> {
    const res = await apiClient.get(`/api/vault/identity-documents/${id}/preview`, {
      params: { side },
      headers: { 'X-Vault-Token': vaultToken },
      responseType: 'blob',
    });
    return res.data;
  },

  // ── Financial Accounts ─────────────────────────────────────────
  async getFinancialAccounts(accountType?: FinancialAccountType, search?: string): Promise<FinancialAccountItem[]> {
    const params: Record<string, string> = {};
    if (accountType) params.accountType = accountType;
    if (search) params.search = search;
    const res = await apiClient.get<FinancialAccountItem[]>('/api/vault/financial', { params });
    return res.data;
  },

  async createFinancialAccount(payload: FinancialAccountPayload): Promise<FinancialAccountItem> {
    const formData = new FormData();
    formData.append('bankName', payload.bankName);
    if (payload.accountNumber) formData.append('accountNumber', payload.accountNumber);
    if (payload.ifsc) formData.append('ifsc', payload.ifsc);
    if (payload.branch) formData.append('branch', payload.branch);
    formData.append('accountType', payload.accountType);
    if (payload.upiId) formData.append('upiId', payload.upiId);
    if (payload.taxInfo) formData.append('taxInfo', payload.taxInfo);
    if (payload.notes) formData.append('notes', payload.notes);
    if (payload.file) formData.append('file', payload.file);

    const res = await apiClient.post<FinancialAccountItem>('/api/vault/financial', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async updateFinancialAccount(id: number, payload: FinancialAccountPayload): Promise<FinancialAccountItem> {
    const formData = new FormData();
    formData.append('bankName', payload.bankName);
    if (payload.accountNumber) formData.append('accountNumber', payload.accountNumber);
    if (payload.ifsc) formData.append('ifsc', payload.ifsc);
    if (payload.branch) formData.append('branch', payload.branch);
    formData.append('accountType', payload.accountType);
    if (payload.upiId) formData.append('upiId', payload.upiId);
    if (payload.taxInfo) formData.append('taxInfo', payload.taxInfo);
    if (payload.notes) formData.append('notes', payload.notes);
    if (payload.file) formData.append('file', payload.file);

    const res = await apiClient.put<FinancialAccountItem>(`/api/vault/financial/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async deleteFinancialAccount(id: number): Promise<void> {
    await apiClient.delete(`/api/vault/financial/${id}`);
  },

  async revealFinancialAccount(id: number, vaultToken: string): Promise<FinancialAccountReveal> {
    const res = await apiClient.post<FinancialAccountReveal>(
      `/api/vault/financial/${id}/reveal`,
      {},
      { headers: { 'X-Vault-Token': vaultToken } }
    );
    return res.data;
  },

  async getFinancialDocumentBlob(id: number, vaultToken: string): Promise<Blob> {
    const res = await apiClient.get(`/api/vault/financial/${id}/preview`, {
      headers: { 'X-Vault-Token': vaultToken },
      responseType: 'blob',
    });
    return res.data;
  },

  // ── Educational & Other Documents ──────────────────────────────
  async getDocuments(section: VaultDocumentSection, category?: VaultDocumentCategory, search?: string): Promise<VaultDocumentItem[]> {
    const params: Record<string, string> = { section };
    if (category) params.category = category;
    if (search) params.search = search;
    const res = await apiClient.get<VaultDocumentItem[]>('/api/vault/documents', { params });
    return res.data;
  },

  async createDocument(payload: VaultDocumentPayload): Promise<VaultDocumentItem> {
    const formData = new FormData();
    formData.append('section', payload.section);
    formData.append('category', payload.category);
    formData.append('title', payload.title);
    if (payload.issuerOrInstitution) formData.append('issuerOrInstitution', payload.issuerOrInstitution);
    if (payload.documentIdentifier) formData.append('documentIdentifier', payload.documentIdentifier);
    if (payload.issueDate) formData.append('issueDate', payload.issueDate);
    if (payload.expiryDate) formData.append('expiryDate', payload.expiryDate);
    if (payload.notes) formData.append('notes', payload.notes);
    if (payload.file) formData.append('file', payload.file);

    const res = await apiClient.post<VaultDocumentItem>('/api/vault/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async updateDocument(id: number, payload: VaultDocumentPayload): Promise<VaultDocumentItem> {
    const formData = new FormData();
    formData.append('category', payload.category);
    formData.append('title', payload.title);
    if (payload.issuerOrInstitution) formData.append('issuerOrInstitution', payload.issuerOrInstitution);
    if (payload.documentIdentifier) formData.append('documentIdentifier', payload.documentIdentifier);
    if (payload.issueDate) formData.append('issueDate', payload.issueDate);
    if (payload.expiryDate) formData.append('expiryDate', payload.expiryDate);
    if (payload.notes) formData.append('notes', payload.notes);
    if (payload.file) formData.append('file', payload.file);

    const res = await apiClient.put<VaultDocumentItem>(`/api/vault/documents/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async deleteDocument(id: number): Promise<void> {
    await apiClient.delete(`/api/vault/documents/${id}`);
  },

  async revealDocument(id: number, vaultToken: string): Promise<VaultDocumentReveal> {
    const res = await apiClient.post<VaultDocumentReveal>(
      `/api/vault/documents/${id}/reveal`,
      {},
      { headers: { 'X-Vault-Token': vaultToken } }
    );
    return res.data;
  },

  async getDocumentBlob(id: number, vaultToken: string): Promise<Blob> {
    const res = await apiClient.get(`/api/vault/documents/${id}/preview`, {
      headers: { 'X-Vault-Token': vaultToken },
      responseType: 'blob',
    });
    return res.data;
  },
};
