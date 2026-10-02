export type SmartDropClassification =
  | 'CERTIFICATE'
  | 'ACHIEVEMENT'
  | 'PROJECT'
  | 'IDENTITY_DOCUMENT'
  | 'FINANCIAL_DOCUMENT'
  | 'EDUCATIONAL_DOCUMENT'
  | 'OTHER_DOCUMENT'
  | 'RESUME'
  | 'UNKNOWN';

export type SmartDropDestination =
  | 'CERTIFICATES'
  | 'ACHIEVEMENTS'
  | 'PROJECTS'
  | 'SECURE_VAULT_IDENTITY'
  | 'SECURE_VAULT_FINANCIAL'
  | 'SECURE_VAULT_EDUCATION'
  | 'SECURE_VAULT_OTHER'
  | 'RESUME_BUILDER'
  | 'UNKNOWN';

export type ConfidenceLevel = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ResumeSkillItem {
  name: string;
  category?: string;
  proficiency?: string;
}

export interface ResumeExperienceItem {
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ResumeEducationItem {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
  grade?: string;
}

export interface ResumeProjectItem {
  title: string;
  description?: string;
  technologies?: string[];
  link?: string;
}

export interface ResumeContentData {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    headline?: string;
    summary?: string;
    website?: string;
  };
  skills?: ResumeSkillItem[];
  experience?: ResumeExperienceItem[];
  education?: ResumeEducationItem[];
  projects?: ResumeProjectItem[];
}

export interface SmartDropAnalysisItem {
  tempFileId: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  classification: SmartDropClassification;
  suggestedDestination: SmartDropDestination;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  explanation: string;
  extractedMetadata: Record<string, string | number | boolean | string[]>;
  resumeData?: ResumeContentData;
  textSnippet?: string;
  duplicateWarning: boolean;
  duplicateMessage?: string;
  duplicateExistingId?: number;
}

export interface SmartDropConfirmPayload {
  tempFileId: string;
  destination: SmartDropDestination;
  metadata: Record<string, string | number | boolean | string[]>;
  resumeData?: ResumeContentData;
  populateProfileSkills?: boolean;
  populateProfileProjects?: boolean;
  populateProfileAchievements?: boolean;
}

export interface SmartDropConfirmResult {
  success: boolean;
  message: string;
  destination: SmartDropDestination;
  createdItem?: unknown;
  navigationUrl?: string;
}

export interface SmartDropBatchConfirmResult {
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  results: SmartDropConfirmResult[];
}
