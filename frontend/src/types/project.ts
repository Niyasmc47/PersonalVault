export type ProjectCategory = 
  | 'ACADEMIC'
  | 'PERSONAL'
  | 'INTERNSHIP'
  | 'HACKATHON'
  | 'OPEN_SOURCE'
  | 'FREELANCE'
  | 'OTHER';

export type ProjectStatus = 
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'CANCELLED';

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  ACADEMIC: 'Academic',
  PERSONAL: 'Personal',
  INTERNSHIP: 'Internship',
  HACKATHON: 'Hackathon',
  OPEN_SOURCE: 'Open Source',
  FREELANCE: 'Freelance',
  OTHER: 'Other',
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  CANCELLED: 'Cancelled',
};

export const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string; border: string }> = {
  PLANNING: { bg: 'var(--color-sky-wash)', text: 'var(--color-carbon)', border: 'var(--color-carbon)' },
  IN_PROGRESS: { bg: 'var(--color-sunburst)', text: 'var(--color-carbon)', border: 'var(--color-carbon)' },
  COMPLETED: { bg: 'var(--color-mint-pop)', text: 'var(--color-carbon)', border: 'var(--color-carbon)' },
  ON_HOLD: { bg: 'var(--color-lavender)', text: 'var(--color-carbon)', border: 'var(--color-carbon)' },
  CANCELLED: { bg: 'var(--color-soft-mist)', text: 'var(--color-carbon)', border: 'var(--color-concrete-gray)' },
};

export interface Project {
  id: number;
  title: string;
  description?: string | null;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  technologies: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  demoUrl?: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  title: string;
  description?: string | null;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  technologies?: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  demoUrl?: string | null;
  featured?: boolean;
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string | null;
  category?: ProjectCategory;
  status?: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  technologies?: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  demoUrl?: string | null;
  featured?: boolean;
}

export interface ProjectFilterParams {
  category?: ProjectCategory | '';
  status?: ProjectStatus | '';
  featured?: boolean;
  search?: string;
  sortBy?: 'recent_updated' | 'recent_created' | 'newest_start' | 'oldest_start' | 'alpha_asc' | 'alpha_desc';
}

export interface ProjectSummary {
  total: number;
  inProgress: number;
  completed: number;
  featured: number;
}
