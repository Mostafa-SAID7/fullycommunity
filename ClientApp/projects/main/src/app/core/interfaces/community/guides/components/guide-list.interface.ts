// Interface matching backend DTO: GuideListDto
import { GuideType, GuideDifficulty } from '../enums';

export interface GuideList {
  id: string;
  title: string;
  slug: string | null;
  viewCount: number;
  coverImageUrl: string | null;
  authorName: string;
  type: GuideType;
  difficulty: GuideDifficulty;
  estimatedMinutes: number | null;
  averageRating: number;
  ratingCount: number;
  isVerified: boolean;
}
