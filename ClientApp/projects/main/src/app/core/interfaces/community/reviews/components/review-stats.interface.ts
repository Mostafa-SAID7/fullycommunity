import { RatingStats } from '../../../common';

// Interface matching backend DTO: ReviewStatsDto
export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

// Alternative: Can also extend RatingStats if backend aligns
// export interface ReviewStats extends RatingStats {
//   totalReviews: number;
// }
