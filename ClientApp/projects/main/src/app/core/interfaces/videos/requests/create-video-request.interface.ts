import { VideoType, VideoVisibility, ContentRating } from '../enums/video-enums';

/**
 * Create Video Request
 */
export interface CreateVideoRequest {
  channelId: string;
  title: string;
  description?: string;
  videoFile: File;
  thumbnailFile?: File;
  type: VideoType;
  visibility: VideoVisibility;
  contentRating: ContentRating;
  categoryId?: string;
  tags?: string[];
  hashtags?: string[];
  locationName?: string;
  latitude?: number;
  longitude?: number;
  allowComments?: boolean;
  allowDuets?: boolean;
  allowStitches?: boolean;
  allowDownloads?: boolean;
  scheduledPublishAt?: string;
  soundId?: string;
  useOriginalAudio?: boolean;
  duetOfVideoId?: string;
  stitchOfVideoId?: string;
  replyToVideoId?: string;
}
