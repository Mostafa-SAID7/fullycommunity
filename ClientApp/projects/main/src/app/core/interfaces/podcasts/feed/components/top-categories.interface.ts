/**
 * Top Categories
 */
export interface TopCategories {
  categories: TopCategory[];
  totalCount: number;
}

/**
 * Top Category
 */
export interface TopCategory {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  showCount: number;
  episodeCount: number;
  subscriberCount: number;
  trendingScore: number;
}
