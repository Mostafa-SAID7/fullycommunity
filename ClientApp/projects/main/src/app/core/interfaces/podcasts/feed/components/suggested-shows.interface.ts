/**
 * Suggested Shows
 */
export interface SuggestedShows {
  shows: SuggestedShow[];
  totalCount: number;
}

/**
 * Suggested Show
 */
export interface SuggestedShow {
  id: string;
  showId: string;
  name: string;
  description: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  isVerified: boolean;
  subscriberCount: number;
  episodeCount: number;
  category: string | null;
  suggestionReason: string;
  isSubscribed: boolean;
}
