export interface CreateLocationReviewRequest {
  rating: number;
  title?: string | null;
  content?: string | null;
  serviceRating?: number | null;
  priceRating?: number | null;
  cleanlinessRating?: number | null;
  mediaUrls?: string[];
  visitDate?: string | null;
}
