import { AuctionStatus, BidStatus } from './enums/marketplace-enums';
import { Product } from './product.interface';

/**
 * Auction
 * Marketplace auction entity
 */
export interface Auction {
  id: string;
  auctionNumber: string;
  productId: string;
  product: Product;
  sellerId: string;
  sellerName: string;
  status: AuctionStatus;
  
  // Pricing
  startingPrice: number;
  hasReserve: boolean;
  reserveMet: boolean;
  buyItNowPrice: number | null;
  currentBid: number;
  bidIncrement: number;
  currency: string;
  
  // Timing
  startTime: string;
  endTime: string;
  extendedUntil: string | null;
  
  // Stats
  bidCount: number;
  winningBidId: string | null;
  viewCount: number;
  watchCount: number;
  
  // Fees
  buyerPremiumPercent: number | null;
  requiresDeposit: boolean;
  depositAmount: number | null;
  
  // Timestamps
  createdAt: string;
}

/**
 * Bid
 * Auction bid entity
 */
export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  status: BidStatus;
  isAutoBid: boolean;
  bidTime: string;
}
