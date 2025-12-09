import { AuctionStatus } from '../enums/marketplace-enums';

/**
 * Auction List Item
 * Lightweight auction for lists
 */
export interface AuctionListItem {
  id: string;
  auctionNumber: string;
  productTitle: string;
  productImageUrl: string | null;
  currentBid: number;
  buyItNowPrice: number | null;
  currency: string;
  bidCount: number;
  endTime: string;
  hasReserve: boolean;
  reserveMet: boolean;
  status: AuctionStatus;
}
