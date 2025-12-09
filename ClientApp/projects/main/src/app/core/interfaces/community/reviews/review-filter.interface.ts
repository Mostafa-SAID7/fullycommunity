import { ReviewSubjectType, ReviewStatus } from './review.enums';

export interface ReviewFilter {
  subjectType?: ReviewSubjectType;
  subjectId?: string;
  carMake?: string;
  carModel?: string;
  carYear?: number;
  minRating?: number;
  maxRating?: number;
  isVerifiedPurchase?: boolean;
  isExpertReview?: boolean;
  isFeatured?: boolean;
  status?: ReviewStatus;
  sortBy?: string;
}
