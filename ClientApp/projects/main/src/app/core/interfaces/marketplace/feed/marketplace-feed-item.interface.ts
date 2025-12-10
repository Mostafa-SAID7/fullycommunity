/**
 * Marketplace Feed Item
 * Feed item specific to marketplace section
 */
export interface MarketplaceFeedItem {
  id: string;
  productId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  currency: string;
  
  // Seller
  sellerId: string;
  sellerName: string;
  sellerAvatarUrl: string | null;
  sellerVerified: boolean;
  sellerRating: number;
  
  // Stats
  viewCount: number;
  favoriteCount: number;
  inquiryCount: number;
  
  // User Actions
  isFavorited: boolean;
  isInCart: boolean;
  
  // Metadata
  condition: string;
  location: string | null;
  category: string | null;
  tags: string[];
  listedAt: string;
  
  // Relevance
  relevanceScore: number;
  recommendationReason: string | null;
  
  // Type
  isAuction: boolean;
  auctionEndsAt: string | null;
}
