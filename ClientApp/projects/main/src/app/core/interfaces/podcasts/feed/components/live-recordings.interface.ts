/**
 * Live Recordings
 */
export interface LiveRecordings {
  recordings: LiveRecording[];
  totalCount: number;
}

/**
 * Live Recording
 */
export interface LiveRecording {
  id: string;
  recordingId: string;
  title: string;
  thumbnailUrl: string | null;
  showName: string;
  showAvatarUrl: string | null;
  listenerCount: number;
  startedAt: string;
  category: string | null;
  tags: string[];
}
