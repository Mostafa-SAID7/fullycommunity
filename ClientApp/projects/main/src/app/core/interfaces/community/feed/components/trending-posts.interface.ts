import { PostType } from '../../posts/enums';

/**
 * Trending posts from community
 */
export interface TrendingPost {
  id: string;
  title: string;
  excerpt: string | null;
  authorName: string;
  authorAvatarUrl: string | null;
  type: PostType;
  coverImageUrl: string | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  trendingScore: number;
  createdAt: string;
}
