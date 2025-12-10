/**
 * Active Auctions
 */
export interface ActiveAuctions {
  auctions: ActiveAuction[];
  totalCount: number;
}

/**
 * Active Auction
 */
export interface ActiveAuction {
  id: string;
  auctionId: string;
  title: string;
  imageUrl: string | null;
  currentBid: number;
  currency: string;
  bidCount: number;
  sellerName: string;
  endsAt: string;
  timeRemaining: string;
  category: string | null;
}
