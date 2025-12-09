/**
 * Complete Upload Request
 */
export interface CompleteUploadRequest {
  videoUrl: string;
  thumbnailUrl?: string;
}

/**
 * Record View Request
 */
export interface RecordViewRequest {
  sessionId?: string;
}

/**
 * Watch Progress Request
 */
export interface WatchProgressRequest {
  watchDuration: string; // TimeSpan
  watchPercent: number;
}

/**
 * Share Request
 */
export interface ShareRequest {
  platform: string; // facebook, twitter, whatsapp, etc.
}
