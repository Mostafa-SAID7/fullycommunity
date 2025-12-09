import { ReviewSubjectType } from '../../reviews/enums';

/**
 * Reviews related to user's car or interests
 */
export interface RelatedReview {
  id: string;
  title: string;
  authorName: string;
  subjectType: ReviewSubjectType;
  carMake: string | null;
  carModel: string | null;
  carYear: number | null;
  rating: number;
  isVerifiedPurchase: boolean;
  isExpertReview: boolean;
  helpfulCount: number;
  createdAt: string;
}
