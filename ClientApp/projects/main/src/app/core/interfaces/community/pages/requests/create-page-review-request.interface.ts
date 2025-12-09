export interface CreatePageReviewRequest {
  rating: number;
  title?: string | null;
  content: string;
  imageUrls?: string[];
}
