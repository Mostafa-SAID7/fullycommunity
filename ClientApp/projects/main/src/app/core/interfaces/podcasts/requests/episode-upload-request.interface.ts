/**
 * Episode Upload Response
 */
export interface EpisodeUploadResponse {
  episodeId: string;
  uploadUrl: string;
  videoUploadUrl: string | null;
  expiresAt: string;
}

/**
 * Complete Episode Upload Request
 */
export interface CompleteEpisodeUploadRequest {
  audioUrl: string;
  videoUrl: string | null;
}

/**
 * Schedule Request
 */
export interface ScheduleRequest {
  publishAt: string;
}
