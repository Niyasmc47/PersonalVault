export type SkillCategory =
  | 'PROGRAMMING_LANGUAGE'
  | 'FRAMEWORK'
  | 'DATABASE'
  | 'CLOUD'
  | 'DEVOPS'
  | 'TOOLS'
  | 'SOFT_SKILLS'
  | 'OTHER';

export type ProficiencyLevel =
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'EXPERT';

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
  categoryDisplayName: string;
  proficiency: ProficiencyLevel;
  proficiencyDisplayName: string;
  yearsOfExperience?: number | null;
  description?: string | null;
  featured: boolean;
  includeInResume: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillPayload {
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsOfExperience?: number | null;
  description?: string | null;
  featured?: boolean;
  includeInResume?: boolean;
  displayOrder?: number;
}

export interface UpdateSkillPayload {
  name?: string;
  category?: SkillCategory;
  proficiency?: ProficiencyLevel;
  yearsOfExperience?: number | null;
  description?: string | null;
  featured?: boolean;
  includeInResume?: boolean;
  displayOrder?: number;
}

export interface SkillFilterParams {
  category?: SkillCategory | '';
  proficiency?: ProficiencyLevel | '';
  featured?: boolean;
  includeInResume?: boolean;
  search?: string;
  sortBy?: 'order' | 'name' | 'proficiency' | 'recent_updated';
}

