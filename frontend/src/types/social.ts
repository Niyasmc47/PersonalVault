export type SocialPlatform =
  | 'GITHUB'
  | 'LINKEDIN'
  | 'PORTFOLIO'
  | 'LEETCODE'
  | 'CODECHEF'
  | 'HACKERRANK'
  | 'KAGGLE'
  | 'BEHANCE'
  | 'DRIBBBLE'
  | 'X'
  | 'YOUTUBE'
  | 'PERSONAL_WEBSITE'
  | 'OTHER';

export interface SocialLink {
  id: number;
  platform: SocialPlatform;
  platformDisplayName: string;
  label: string;
  url: string;
  username?: string | null;
  includeInResume: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSocialLinkPayload {
  platform: SocialPlatform;
  label: string;
  url: string;
  username?: string | null;
  includeInResume?: boolean;
  displayOrder?: number;
}

export interface UpdateSocialLinkPayload {
  platform?: SocialPlatform;
  label?: string;
  url?: string;
  username?: string | null;
  includeInResume?: boolean;
  displayOrder?: number;
}

