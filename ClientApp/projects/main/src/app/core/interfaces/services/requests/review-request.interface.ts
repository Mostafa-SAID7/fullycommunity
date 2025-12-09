/**
 * Create Service Review Request
 */
export interface CreateServiceReviewRequest {
  providerId: string;
  bookingId: string | null;
  overallRating: number;
  qualityRating: number | null;
  timelinessRating: number | null;
  communicationRating: number | null;
  valueRating: number | null;
  title: string | null;
  comment: string | null;
  photoUrls: string[] | null;
  isRecommended: boolean;
}

/**
 * Provider Review Response Request
 */
export interface ProviderReviewResponseRequest {
  response: string;
}
