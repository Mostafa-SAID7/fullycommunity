import { VideoVisibility, ContentRating } from '../enums/video-enums';

/**
 * Update Video Request
 */
export interface UpdateVideoRequest {
  title?: string;
  description?: string;
  visibility?: VideoVisibility;
  contentRating?: ContentRating;
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
  showLikeCount?: boolean;
  isPinned?: boolean;
  scheduledPublishAt?: string;
  thumbnailFile?: File;
}
