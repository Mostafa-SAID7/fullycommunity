/**
 * Podcast Rating Summary
 */
export interface PodcastRatingSummary {
  averageRating: number;
  totalRatings: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

/**
 * Podcast Rating
 */
export interface PodcastRating {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  rating: number;
  title: string | null;
  review: string | null;
  helpfulCount: number;
  isVerifiedListener: boolean;
  ratedAt: string;
}
