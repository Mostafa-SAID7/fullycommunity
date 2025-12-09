import { FeedItemType } from './enums';

/**
 * Generic feed item that can represent any content type
 * Used for unified feed display
 */
export interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  content: string | null;
  excerpt: string | null;
  imageUrl: string | null;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  categoryName: string | null;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  publishedAt: string | null;
  url: string; // Navigation URL
}
