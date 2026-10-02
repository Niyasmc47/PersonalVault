export type CertificateCategory =
  | 'COURSE'
  | 'INTERNSHIP'
  | 'WORKSHOP'
  | 'HACKATHON'
  | 'COMPETITION'
  | 'PROFESSIONAL'
  | 'ACADEMIC'
  | 'OTHER';

export type ExpiryStatus =
  | 'ACTIVE'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'NO_EXPIRATION';

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  description?: string;
  category: CertificateCategory;
  categoryDisplayName?: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  googleDriveFileId: string;
  originalFileName: string;
  mimeType: string;
  fileSize?: number;
  expiryStatus: ExpiryStatus;
  expiryStatusDisplayName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificatePayload {
  title: string;
  issuer: string;
  description?: string;
  category: CertificateCategory;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  file: File;
}

export interface UpdateCertificatePayload {
  title: string;
  issuer: string;
  description?: string;
  category: CertificateCategory;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface CertificateSummary {
  totalCertificates: number;
  activeCertificates: number;
  expiringSoonCertificates: number;
  expiredCertificates: number;
  noExpirationCertificates: number;
  categoryCounts: Record<CertificateCategory, number>;
}

export interface GoogleDriveStatus {
  connected: boolean;
  driveEmail?: string;
  connectedAt?: string;
  certificatesCount: number;
}

export interface CertificateFilterParams {
  category?: CertificateCategory;
  search?: string;
  expiryStatus?: ExpiryStatus;
}

export const CATEGORY_LABELS: Record<CertificateCategory, string> = {
  COURSE: 'Course',
  INTERNSHIP: 'Internship',
  WORKSHOP: 'Workshop',
  HACKATHON: 'Hackathon',
  COMPETITION: 'Competition',
  PROFESSIONAL: 'Professional',
  ACADEMIC: 'Academic',
  OTHER: 'Other',
};

export const CATEGORY_COLORS: Record<CertificateCategory, { bg: string; color: string; border: string }> = {
  COURSE: { bg: '#e9ccff', color: '#000000', border: '#000000' },
  INTERNSHIP: { bg: '#ffd731', color: '#000000', border: '#000000' },
  WORKSHOP: { bg: '#55db9c', color: '#000000', border: '#000000' },
  HACKATHON: { bg: '#fb4903', color: '#ffffff', border: '#000000' },
  COMPETITION: { bg: '#dceeff', color: '#000000', border: '#000000' },
  PROFESSIONAL: { bg: '#4da2ff', color: '#ffffff', border: '#000000' },
  ACADEMIC: { bg: '#cccccc', color: '#000000', border: '#000000' },
  OTHER: { bg: '#e9e9e9', color: '#000000', border: '#000000' },
};

export const EXPIRY_LABELS: Record<ExpiryStatus, string> = {
  ACTIVE: 'Active',
  EXPIRING_SOON: 'Expiring Soon',
  EXPIRED: 'Expired',
  NO_EXPIRATION: 'No Expiration',
};

export const EXPIRY_COLORS: Record<ExpiryStatus, { bg: string; color: string }> = {
  ACTIVE: { bg: '#55db9c', color: '#000000' },
  EXPIRING_SOON: { bg: '#ffd731', color: '#000000' },
  EXPIRED: { bg: '#fb4903', color: '#ffffff' },
  NO_EXPIRATION: { bg: '#e9e9e9', color: '#000000' },
};
