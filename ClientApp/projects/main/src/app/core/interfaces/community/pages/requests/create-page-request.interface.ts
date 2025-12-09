import { PageCategory, PageType } from '../enums';

export interface CreatePageRequest {
  name: string;
  username: string;
  description: string | null;
  bio: string | null;
  category: PageCategory;
  type: PageType;
  isPublic: boolean;
  profileImageUrl?: string | null;
  coverImageUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  businessHours?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  youTubeUrl?: string | null;
  linkedInUrl?: string | null;
}
