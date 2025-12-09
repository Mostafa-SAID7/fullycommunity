import { ContentRating } from '../enums/video-enums';

/**
 * Create Live Stream Request
 */
export interface CreateLiveStreamRequest {
  title: string;
  description?: string;
  contentRating: ContentRating;
  scheduledStartAt?: string;
  categoryId?: string;
  tags?: string[];
  allowChat?: boolean;
  slowModeEnabled?: boolean;
  slowModeSeconds?: number;
  subscribersOnlyChat?: boolean;
  allowGifts?: boolean;
  saveRecording?: boolean;
}

/**
 * Update Live Stream Request
 */
export interface UpdateLiveStreamRequest {
  title?: string;
  description?: string;
  thumbnailFile?: File;
  allowChat?: boolean;
  slowModeEnabled?: boolean;
  slowModeSeconds?: number;
  subscribersOnlyChat?: boolean;
  allowGifts?: boolean;
}

/**
 * Start Live Stream Response
 */
export interface StartLiveStreamResponse {
  liveStreamId: string;
  streamKey: string;
  streamUrl: string;
  playbackUrl: string;
  chatRoomId: string;
}

/**
 * Send Chat Message Request
 */
export interface SendChatMessageRequest {
  message: string;
}

/**
 * Send Gift Request
 */
export interface SendGiftRequest {
  giftTypeId: string;
  quantity: number;
  message?: string;
}
