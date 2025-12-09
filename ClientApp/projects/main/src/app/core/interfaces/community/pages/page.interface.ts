// Interface matching backend DTO: PageDto
import { PageCategory, PageType } from './page.enums';
import { PageOwner } from './page-owner.interface';

export interface Page {
  id: string;
  name: string;
  username: string;
  description: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  category: PageCategory;
  type: PageType;
  isVerified: boolean;
  isPublic: boolean;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  businessHours: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  youTubeUrl: string | null;
  linkedInUrl: string | null;
  owner: PageOwner;
  followerCount: number;
  postCount: number;
  storyCount: number;
  averageRating: number;
  reviewCount: number;
  isFollowing: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  createdAt: string;
}

// Interface matching backend DTO: PageListDto
export interface PageList {
  id: string;
  name: string;
  username: string;
  description: string | null;
  profileImageUrl: string | null;
  category: PageCategory;
  isVerified: boolean;
  followerCount: number;
  averageRating: number;
  isFollowing: boolean;
}
