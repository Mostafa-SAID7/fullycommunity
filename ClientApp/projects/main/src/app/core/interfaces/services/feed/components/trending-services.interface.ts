/**
 * Trending Services
 */
export interface TrendingServices {
  services: TrendingService[];
  category: string | null;
  timeRange: string;
  lastUpdated: string;
}

/**
 * Trending Service
 */
export interface TrendingService {
  id: string;
  serviceId: string;
  title: string;
  imageUrl: string | null;
  price: number;
  currency: string;
  providerName: string;
  providerRating: number;
  bookingCount: number;
  trendScore: number;
  velocityScore: number;
  trendingRank: number;
  category: string;
}
