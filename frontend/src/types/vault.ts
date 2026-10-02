// Credential types
export type CredentialCategory =
  | 'LOGIN'
  | 'EMAIL'
  | 'SOCIAL'
  | 'FINANCIAL'
  | 'WORK'
  | 'STREAMING'
  | 'OTHER';

export interface CredentialItem {
  id: number;
  name: string;
  username: string;
  url?: string;
  category: CredentialCategory;
  passwordAvailable: boolean;
  notesAvailable: boolean;
  apiKeysAvailable: boolean;
  recoveryCodesAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CredentialPayload {
  name: string;
  username: string;
  password?: string;
  url?: string;
  category: CredentialCategory;
  notes?: string;
  apiKeys?: string;
  recoveryCodes?: string;
}

export interface CredentialReveal {
  id: number;
  password?: string;
  notes?: string;
  apiKeys?: string;
  recoveryCodes?: string;
}

// Identity Document types
export type IdentityDocumentType =
  | 'AADHAAR'
  | 'PAN'
  | 'PASSPORT'
  | 'DRIVING_LICENCE'
  | 'VOTER_ID'
  | 'OTHER';

export interface IdentityDocumentItem {
  id: number;
  type: IdentityDocumentType;
  holderName: string;
  maskedNumber: string;
  issueDate?: string;
  expiryDate?: string;
  hasNotes: boolean;
  hasFrontFile: boolean;
  hasBackFile: boolean;
  fileNameFront?: string;
  fileNameBack?: string;
  mimeTypeFront?: string;
  mimeTypeBack?: string;
  fileSizeFront?: number;
  fileSizeBack?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IdentityDocumentPayload {
  type: IdentityDocumentType;
  holderName: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
  frontFile?: File | null;
  backFile?: File | null;
}

export interface IdentityDocumentReveal {
  id: number;
  documentNumber: string;
  notes?: string;
}

// Financial Account types
export type FinancialAccountType =
  | 'SAVINGS'
  | 'CURRENT'
  | 'SALARY'
  | 'FIXED_DEPOSIT'
  | 'DEMAT'
  | 'OTHER';

export interface FinancialAccountItem {
  id: number;
  bankName: string;
  maskedAccountNumber: string;
  ifsc?: string;
  branch?: string;
  accountType: FinancialAccountType;
  upiId?: string;
  hasTaxInfo: boolean;
  hasNotes: boolean;
  hasDocument: boolean;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialAccountPayload {
  bankName: string;
  accountNumber?: string;
  ifsc?: string;
  branch?: string;
  accountType: FinancialAccountType;
  upiId?: string;
  taxInfo?: string;
  notes?: string;
  file?: File | null;
}

export interface FinancialAccountReveal {
  id: number;
  accountNumber: string;
  taxInfo?: string;
  notes?: string;
}

// Vault Document types (Education & Other)
export type VaultDocumentSection = 'EDUCATION' | 'OTHER';

export type VaultDocumentCategory =
  | 'DEGREE'
  | 'MARK_SHEET'
  | 'TRANSCRIPT'
  | 'STUDENT_ID'
  | 'INTERNSHIP_CERTIFICATE'
  | 'OFFER_LETTER'
  | 'EXPERIENCE_CERTIFICATE'
  | 'PROFESSIONAL_CERTIFICATION'
  | 'CONTRACT'
  | 'INSURANCE'
  | 'PROPERTY'
  | 'TAX_DOCUMENT'
  | 'MEDICAL'
  | 'VEHICLE'
  | 'OTHER';

export interface VaultDocumentItem {
  id: number;
  section: VaultDocumentSection;
  category: VaultDocumentCategory;
  title: string;
  issuerOrInstitution?: string;
  documentIdentifier?: string;
  issueDate?: string;
  expiryDate?: string;
  hasNotes: boolean;
  originalFileName: string;
  mimeType: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VaultDocumentPayload {
  section: VaultDocumentSection;
  category: VaultDocumentCategory;
  title: string;
  issuerOrInstitution?: string;
  documentIdentifier?: string;
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
  file?: File | null;
}

export interface VaultDocumentReveal {
  id: number;
  notes?: string;
}

// Vault Status & Auth types
export interface VaultStatus {
  configured: boolean;
  unlocked: boolean;
  passwordHint?: string;
  autoLockMinutes?: number;
}

export interface VaultUnlockResponse {
  vaultToken: string;
  expiresInSeconds: number;
}

export type VaultTab = 'passwords' | 'identity' | 'finance' | 'education' | 'other';
