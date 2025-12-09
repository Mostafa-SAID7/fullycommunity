/**
 * Create Product Review Request
 */
export interface CreateProductReviewRequest {
  productId: string;
  orderId: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  qualityRating: number | null;
  valueRating: number | null;
  accuracyRating: number | null;
  photoUrls: string[] | null;
  isRecommended: boolean;
}

/**
 * Create Seller Review Request
 */
export interface CreateSellerReviewRequest {
  sellerId: string;
  orderId: string;
  rating: number;
  comment: string | null;
  communicationRating: number | null;
  shippingSpeedRating: number | null;
  itemAsDescribedRating: number | null;
  isRecommended: boolean;
}

/**
 * Respond To Review Request
 */
export interface RespondToReviewRequest {
  response: string;
}
