import type { SkillCategory, ProficiencyLevel } from '../../skills/types';
import type { AchievementCategory } from '../../achievements/types';
import type { SocialPlatform } from '../../social/types';
import type { ProjectCategory } from '../../projects/types';

export type ResumeTemplate =
  | 'PROFESSIONAL'
  | 'MODERN'
  | 'MINIMAL'
  | 'ATS_FRIENDLY'
  | 'ACADEMIC';

export interface ResumePersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  website?: string;
}

export interface ResumeSocialLink {
  id?: number;
  platform: SocialPlatform;
  label: string;
  url: string;
  username?: string | null;
  enabled: boolean;
}

export interface ResumeSkill {
  id?: number;
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsOfExperience?: number | null;
  enabled: boolean;
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  description?: string;
  highlights: string[];
  enabled: boolean;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  grade?: string;
  description?: string;
  enabled: boolean;
}

export interface ResumeProject {
  id?: number;
  title: string;
  description?: string;
  category?: ProjectCategory;
  startDate?: string;
  endDate?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  highlights: string[];
  enabled: boolean;
}

export interface ResumeCertificate {
  id?: number;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  credentialId?: string;
  enabled: boolean;
}

export interface ResumeAchievement {
  id?: number;
  title: string;
  organization: string;
  achievementDate: string;
  description?: string;
  category: AchievementCategory;
  url?: string;
  enabled: boolean;
}

export interface ResumeFormatting {
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  primaryColor: string;
  spacing: 'compact' | 'comfortable' | 'spacious';
}

export interface ResumeContent {
  personalInfo: ResumePersonalInfo;
  socialLinks: ResumeSocialLink[];
  skills: ResumeSkill[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  certificates: ResumeCertificate[];
  achievements: ResumeAchievement[];
  sectionOrder: string[];
  sectionTitles: Record<string, string>;
  sectionVisibility: Record<string, boolean>;
  formatting: ResumeFormatting;
}

export interface ResumeSummary {
  id: number;
  name: string;
  targetRole?: string | null;
  template: ResumeTemplate;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: number;
  name: string;
  targetRole?: string | null;
  template: ResumeTemplate;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumePayload {
  name: string;
  targetRole?: string;
  template: ResumeTemplate;
  content?: ResumeContent;
  autoPopulate?: boolean;
}

export interface UpdateResumePayload {
  name?: string;
  targetRole?: string;
  template?: ResumeTemplate;
  content?: ResumeContent;
}

