/**
 * Listening History
 */
export interface ListeningHistory {
  episodeId: string;
  episodeTitle: string;
  podcastTitle: string;
  thumbnailUrl: string | null;
  duration: string; // TimeSpan
  currentPosition: string; // TimeSpan
  progressPercent: number;
  isCompleted: boolean;
  lastListenedAt: string;
}

/**
 * Queue Item
 */
export interface QueueItem {
  position: number;
  episodeId: string;
  episodeTitle: string;
  podcastTitle: string;
  thumbnailUrl: string | null;
  duration: string; // TimeSpan
  addedAt: string;
}
