// Interface matching backend DTO: NewsListDto

export interface NewsList {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  coverImageUrl: string | null;
  authorName: string;
  categoryName: string | null;
  publishedAt: string | null;
  viewCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
}
