// Interface matching backend DTO: GuideDto
import { GuideType, GuideDifficulty, GuideStatus } from './guide.enums';
import { GuideStep } from './guide-step.interface';

export interface Guide {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  coverImageUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  tags: string[];
  type: GuideType;
  difficulty: GuideDifficulty;
  status: GuideStatus;
  publishedAt: string | null;
  estimatedMinutes: number | null;
  carMake: string | null;
  carModel: string | null;
  carYearFrom: number | null;
  carYearTo: number | null;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  averageRating: number;
  ratingCount: number;
  isFeatured: boolean;
  isVerified: boolean;
  isBookmarkedByCurrentUser: boolean;
  steps: GuideStep[];
  createdAt: string;
}

// Interface matching backend DTO: GuideListDto
export interface GuideList {
  id: string;
  title: string;
  coverImageUrl: string | null;
  authorName: string;
  type: GuideType;
  difficulty: GuideDifficulty;
  estimatedMinutes: number | null;
  averageRating: number;
  ratingCount: number;
  isVerified: boolean;
}
