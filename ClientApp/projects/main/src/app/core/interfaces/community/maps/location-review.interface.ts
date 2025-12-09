// Interface matching backend DTO: LocationReviewDto

export interface LocationReview {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  rating: number;
  title: string | null;
  content: string | null;
  serviceRating: number | null;
  priceRating: number | null;
  cleanlinessRating: number | null;
  mediaUrls: string[];
  helpfulCount: number;
  visitDate: string | null;
  ownerResponse: string | null;
  ownerResponseAt: string | null;
  createdAt: string;
}
