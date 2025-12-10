import { FeedItemType, FeedContentSource } from './enums/home-enums';

/**
 * Search Request
 */
export interface SearchRequest {
  query: string;
  filters: SearchFilters | null;
  page: number;
  pageSize: number;
}

/**
 * Search Filters
 */
export interface SearchFilters {
  contentTypes: FeedItemType[] | null;
  sources: FeedContentSource[] | null;
  categories: string[] | null;
  tags: string[] | null;
  dateFrom: string | null;
  dateTo: string | null;
  location: string | null;
  radiusKm: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  verified: boolean | null;
}

/**
 * Search Result
 */
export interface SearchResult {
  id: string;
  type: FeedItemType;
  source: FeedContentSource;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  url: string;
  
  // Highlight
  highlightedTitle: string | null;
  highlightedDescription: string | null;
  
  // Relevance
  relevanceScore: number;
  matchedFields: string[];
  
  // Metadata
  authorName: string | null;
  category: string | null;
  publishedAt: string | null;
}

/**
 * Search Suggestions
 */
export interface SearchSuggestions {
  query: string;
  suggestions: SearchSuggestion[];
}

/**
 * Search Suggestion
 */
export interface SearchSuggestion {
  text: string;
  type: SuggestionType;
  count: number | null;
  iconUrl: string | null;
}

/**
 * Suggestion Type
 */
export enum SuggestionType {
  Query = 0,
  User = 1,
  Tag = 2,
  Category = 3,
  Location = 4
}

/**
 * Search History
 */
export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  filters: SearchFilters | null;
  resultCount: number;
  searchedAt: string;
}

/**
 * Popular Searches
 */
export interface PopularSearches {
  searches: PopularSearch[];
  timeRange: string;
}

/**
 * Popular Search
 */
export interface PopularSearch {
  query: string;
  searchCount: number;
  trendingScore: number;
  category: string | null;
}
