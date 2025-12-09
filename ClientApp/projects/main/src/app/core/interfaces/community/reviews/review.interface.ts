// Interface matching backend DTO: ReviewDto
import { ReviewSubjectType, OwnershipStatus, ReviewStatus } from './review.enums';
import { ReviewMedia } from './review-media.interface';

export interface Review {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  title: string;
  slug: string | null;
  content: string;
  subjectType: ReviewSubjectType;
  subjectId: string | null;
  carMake: string | null;
  carModel: string | null;
  carYear: number | null;
  carTrim: string | null;
  ownershipStatus: OwnershipStatus | null;
  ownershipMonths: number | null;
  milesDriven: number | null;
  overallRating: number;
  performanceRating: number | null;
  comfortRating: number | null;
  reliabilityRating: number | null;
  valueRating: number | null;
  fuelEconomyRating: number | null;
  styleRating: number | null;
  technologyRating: number | null;
  pros: string[];
  cons: string[];
  coverImageUrl: string | null;
  media: ReviewMedia[];
  status: ReviewStatus;
  publishedAt: string | null;
  viewCount: number;
  helpfulCount: number;
  commentCount: number;
  isVerifiedPurchase: boolean;
  isExpertReview: boolean;
  isFeatured: boolean;
  currentUserFoundHelpful: boolean | null;
  createdAt: string;
}

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
