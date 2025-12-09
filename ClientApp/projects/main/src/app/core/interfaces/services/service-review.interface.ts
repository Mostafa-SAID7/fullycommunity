/**
 * Service Review
 */
export interface ServiceReview {
  id: string;
  providerId: string;
  providerName: string;
  customerId: string;
  customerName: string;
  overallRating: number;
  qualityRating: number | null;
  timelinessRating: number | null;
  valueRating: number | null;
  title: string | null;
  comment: string | null;
  photoUrls: string[];
  isVerifiedPurchase: boolean;
  providerResponse: string | null;
  respondedAt: string | null;
  helpfulCount: number;
  createdAt: string;
}
