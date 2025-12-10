/**
 * Popular Categories
 */
export interface PopularCategories {
  categories: PopularCategory[];
  totalCount: number;
}

/**
 * Popular Category
 */
export interface PopularCategory {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  serviceCount: number;
  providerCount: number;
  bookingCount: number;
  averagePrice: number;
  currency: string;
  trendingScore: number;
}
