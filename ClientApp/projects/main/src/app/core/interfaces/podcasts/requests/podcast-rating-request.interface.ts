/**
 * Create Rating Request
 */
export interface CreateRatingRequest {
  rating: number;
  title: string | null;
  review: string | null;
}

/**
 * Update Rating Request
 */
export interface UpdateRatingRequest {
  rating: number | null;
  title: string | null;
  review: string | null;
}
