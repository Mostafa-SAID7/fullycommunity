/**
 * Generic stats interface for content engagement
 * Used across Posts, News, Reviews, QA, etc.
 */
export interface ContentStats {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

/**
 * Rating stats interface
 * Used in Reviews, Guides, Pages, Maps, etc.
 */
export interface RatingStats {
  averageRating: number;
  ratingCount: number;
  rating1Count?: number;
  rating2Count?: number;
  rating3Count?: number;
  rating4Count?: number;
  rating5Count?: number;
}
