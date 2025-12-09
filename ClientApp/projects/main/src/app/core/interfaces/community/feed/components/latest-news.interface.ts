/**
 * Latest news articles
 */
export interface LatestNews {
  id: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  authorName: string;
  categoryName: string | null;
  isBreaking: boolean;
  isFeatured: boolean;
  viewCount: number;
  publishedAt: string | null;
}
