import { FeedItemType } from '../enums';

/**
 * Personalized content suggestions based on user interests
 */
export interface SuggestedContent {
  id: string;
  type: FeedItemType;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  reason: string; // Why this is suggested (e.g., "Based on your interests in BMW")
  relevanceScore: number;
  url: string;
}
