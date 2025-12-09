// Interface matching backend DTO: GuideDto
import { GuideType, GuideDifficulty, GuideStatus } from './enums';
import { GuideStep } from './components/guide-step.interface';

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
