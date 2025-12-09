import { MarketplaceCategory, AuctionStatus } from '../enums/marketplace-enums';

/**
 * Auction Search Request
 */
export interface AuctionSearchRequest {
  keywords: string | null;
  category: MarketplaceCategory | null;
  status: AuctionStatus | null;
  minPrice: number | null;
  maxPrice: number | null;
  hasBuyItNow: boolean | null;
  endingSoon: boolean | null;
  sortBy: string | null;
  sortDescending: boolean;
  page: number;
  pageSize: number;
}
