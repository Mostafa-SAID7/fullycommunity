/**
 * Suggested Channels
 */
export interface SuggestedChannels {
  channels: SuggestedChannel[];
  totalCount: number;
}

/**
 * Suggested Channel
 */
export interface SuggestedChannel {
  id: string;
  channelId: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  description: string | null;
  isVerified: boolean;
  subscriberCount: number;
  videoCount: number;
  suggestionReason: string;
  isSubscribed: boolean;
}
