import { VideoType, VideoVisibility, ContentRating } from '../enums/video-enums';

/**
 * Create Video Request
 */
export interface CreateVideoRequest {
  title: string;
  description?: string;
  videoFile?: File; // Optional for upload flow
  thumbnailFile?: File;
  type: VideoType;
  visibility: VideoVisibility;
  contentRating: ContentRating;
  scheduledPublishAt?: string;
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
  soundId?: string;
  soundClipStart?: string; // TimeSpan
  soundClipEnd?: string; // TimeSpan
  useOriginalAudio?: boolean;
  duetOfVideoId?: string;
  stitchOfVideoId?: string;
  replyToVideoId?: string;
  isSponsoredContent?: boolean;
  sponsorName?: string;
}
