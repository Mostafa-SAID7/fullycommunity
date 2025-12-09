import { PageCategory, PageType } from '../../pages/enums';

/**
 * Top pages based on followers, activity, and engagement
 */
export interface TopPage {
  id: string;
  name: string;
  username: string;
  description: string | null;
  profileImageUrl: string | null;
  category: PageCategory;
  type: PageType;
  isVerified: boolean;
  followerCount: number;
  postCount: number;
  averageRating: number;
  reviewCount: number;
  engagementScore: number; // Combined metric for ranking
  isFollowing: boolean;
}
