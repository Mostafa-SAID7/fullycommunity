import { ReviewSubjectType, OwnershipStatus } from './review.enums';

export interface CreateReviewRequest {
  title: string;
  content: string;
  subjectType: ReviewSubjectType;
  subjectId?: string | null;
  carMake?: string | null;
  carModel?: string | null;
  carYear?: number | null;
  carTrim?: string | null;
  ownershipStatus?: OwnershipStatus | null;
  ownershipMonths?: number | null;
  milesDriven?: number | null;
  overallRating: number;
  performanceRating?: number | null;
  comfortRating?: number | null;
  reliabilityRating?: number | null;
  valueRating?: number | null;
  pros?: string[];
  cons?: string[];
  coverImageUrl?: string | null;
}

export interface UpdateReviewRequest extends Partial<CreateReviewRequest> {}

export interface CreateReviewCommentRequest {
  content: string;
  parentId?: string | null;
}
