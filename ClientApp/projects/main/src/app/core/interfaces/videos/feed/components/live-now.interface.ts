/**
 * Live Now
 */
export interface LiveNow {
  streams: LiveStream[];
  totalCount: number;
}

/**
 * Live Stream Item
 */
export interface LiveStream {
  id: string;
  streamId: string;
  title: string;
  thumbnailUrl: string | null;
  channelName: string;
  channelAvatarUrl: string | null;
  viewerCount: number;
  startedAt: string;
  category: string | null;
  tags: string[];
}
