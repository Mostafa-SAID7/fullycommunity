/**
 * Create Auction Request
 */
export interface CreateAuctionRequest {
  productId: string;
  startingPrice: number;
  reservePrice: number | null;
  buyItNowPrice: number | null;
  bidIncrement: number;
  currency: string;
  startTime: string;
  endTime: string;
  autoExtend: boolean;
  extendMinutes: number;
  buyerPremiumPercent: number | null;
  termsAndConditions: string | null;
  requiresDeposit: boolean;
  depositAmount: number | null;
}

/**
 * Place Bid Request
 */
export interface PlaceBidRequest {
  amount: number;
  maxBid: number | null;
}

/**
 * Buy It Now Request
 */
export interface BuyItNowRequest {
  auctionId: string;
}
