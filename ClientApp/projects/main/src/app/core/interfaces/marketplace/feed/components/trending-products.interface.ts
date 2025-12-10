/**
 * Trending Products
 */
export interface TrendingProducts {
  products: TrendingProduct[];
  category: string | null;
  timeRange: string;
  lastUpdated: string;
}

/**
 * Trending Product
 */
export interface TrendingProduct {
  id: string;
  productId: string;
  title: string;
  imageUrl: string | null;
  price: number;
  currency: string;
  sellerName: string;
  viewCount: number;
  favoriteCount: number;
  trendScore: number;
  velocityScore: number;
  trendingRank: number;
  listedAt: string;
}
