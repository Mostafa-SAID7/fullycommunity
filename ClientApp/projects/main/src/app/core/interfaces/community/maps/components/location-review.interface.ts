// Interface matching backend DTO: LocationReviewDto

export interface LocationReview {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  rating: number;
  title: string | null;
  content: string | null;
  serviceRating: number | null;
  priceRating: number | null;
  cleanlinessRating: number | null;
  mediaUrls: string[];
  visitDate: string | null;
  helpfulCount: number;
  createdAt: string;
}
