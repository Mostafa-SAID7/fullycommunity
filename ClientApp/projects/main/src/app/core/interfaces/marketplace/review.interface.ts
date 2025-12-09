/**
 * Product Review
 */
export interface ProductReview {
  id: string;
  productId: string;
  reviewerId: string;
  reviewerName: string;
  orderId: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  qualityRating: number | null;
  valueRating: number | null;
  accuracyRating: number | null;
  photoUrls: string[];
  isVerifiedPurchase: boolean;
  isRecommended: boolean;
  sellerResponse: string | null;
  respondedAt: string | null;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
}

/**
 * Seller Review
 */
export interface SellerReview {
  id: string;
  sellerId: string;
  sellerName: string;
  reviewerId: string;
  reviewerName: string;
  orderId: string;
  rating: number;
  comment: string | null;
  communicationRating: number | null;
  shippingSpeedRating: number | null;
  itemAsDescribedRating: number | null;
  isRecommended: boolean;
  sellerResponse: string | null;
  respondedAt: string | null;
  createdAt: string;
}

/**
 * Review Summary
 */
export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
  recommendedPercent: number;
}
