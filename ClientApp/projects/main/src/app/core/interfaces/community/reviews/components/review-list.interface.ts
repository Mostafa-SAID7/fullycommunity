// Interface matching backend DTO: ReviewListDto

export interface ReviewList {
  id: string;
  title: string;
  authorName: string;
  authorAvatarUrl: string | null;
  carMake: string | null;
  carModel: string | null;
  carYear: number | null;
  overallRating: number;
  coverImageUrl: string | null;
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  isExpertReview: boolean;
  createdAt: string;
}
