// Interface matching backend DTO: GuideRatingDto

export interface GuideRating {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  rating: number;
  review: string | null;
  createdAt: string;
}
