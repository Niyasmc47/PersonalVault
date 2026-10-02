export type AchievementCategory =
  | 'COMPETITION'
  | 'HACKATHON'
  | 'AWARD'
  | 'ACADEMIC'
  | 'LEADERSHIP'
  | 'RESEARCH'
  | 'PUBLICATION'
  | 'VOLUNTEER'
  | 'SPORTS'
  | 'OTHER';

export interface Achievement {
  id: number;
  title: string;
  description?: string | null;
  organization: string;
  achievementDate: string;
  category: AchievementCategory;
  categoryDisplayName: string;
  url?: string | null;
  featured: boolean;
  includeInResume: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAchievementPayload {
  title: string;
  description?: string | null;
  organization: string;
  achievementDate: string;
  category: AchievementCategory;
  url?: string | null;
  featured?: boolean;
  includeInResume?: boolean;
  displayOrder?: number;
}

export interface UpdateAchievementPayload {
  title?: string;
  description?: string | null;
  organization?: string;
  achievementDate?: string;
  category?: AchievementCategory;
  url?: string | null;
  featured?: boolean;
  includeInResume?: boolean;
  displayOrder?: number;
}

export interface AchievementFilterParams {
  category?: AchievementCategory | '';
  featured?: boolean;
  includeInResume?: boolean;
  search?: string;
}

