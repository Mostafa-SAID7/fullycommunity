export interface CreateNewsRequest {
  title: string;
  excerpt: string | null;
  content: string;
  coverImageUrl?: string | null;
  videoUrl?: string | null;
  categoryId?: string | null;
  tags?: string[];
  isFeatured?: boolean;
  isBreaking?: boolean;
  sourceName?: string | null;
  sourceUrl?: string | null;
}

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {}
