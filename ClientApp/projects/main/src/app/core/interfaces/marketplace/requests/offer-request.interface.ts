/**
 * Create Offer Request
 */
export interface CreateOfferRequest {
  productId: string;
  offerAmount: number;
  quantity: number;
  message: string | null;
}

/**
 * Respond To Offer Request
 */
export interface RespondToOfferRequest {
  accept: boolean;
  counterOfferAmount: number | null;
  response: string | null;
}
