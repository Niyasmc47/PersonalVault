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

export interface Project {
  id: number;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
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

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {}
