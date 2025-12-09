// Interface matching backend DTO: GuideRatingDto

export interface GuideRating {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  review: string | null;
  isHelpful: boolean;
  createdAt: string;
}
