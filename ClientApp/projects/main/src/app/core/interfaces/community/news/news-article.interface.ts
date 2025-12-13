// Interface matching backend DTO: NewsArticleDto
import { NewsStatus } from './enums';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  coverImageUrl: string | null;
  videoUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  tags: string[];
  status: NewsStatus;
  publishedAt: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  sourceName: string | null;
  sourceUrl: string | null;
  createdAt: string;

  // Extended properties for UI
  isLiked: boolean;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  category: {
    id: string;
    name: string;
  } | null;
}
