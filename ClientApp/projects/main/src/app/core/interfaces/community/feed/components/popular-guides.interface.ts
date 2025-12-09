import { GuideType, GuideDifficulty } from '../../guides/enums';

/**
 * Popular guides
 */
export interface PopularGuide {
  id: string;
  title: string;
  coverImageUrl: string | null;
  authorName: string;
  type: GuideType;
  difficulty: GuideDifficulty;
  averageRating: number;
  ratingCount: number;
  viewCount: number;
  bookmarkCount: number;
  isVerified: boolean;
}
