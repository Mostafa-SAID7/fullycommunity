/**
 * Episode Share
 */
export interface EpisodeShare {
  id: string;
  shareUrl: string;
  platform: string;
  timestamp: string | null; // TimeSpan
  sharedAt: string;
}
