// Interface matching backend DTO: NewsListDto

export interface NewsList {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  coverImageUrl: string | null;
  authorName: string;
  category: { id: string; name: string; } | null;
  likeCount: number;
  publishedAt: string | null;
  viewCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
}
