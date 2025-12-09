import { BaseFilter } from '../../../../types';
import { ReviewSubjectType, ReviewStatus } from '../enums';

export interface ReviewFilter extends BaseFilter {
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
}
