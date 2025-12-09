import { BaseFilter } from '../../../types/common.types';
import { VideoType, VideoStatus, VideoVisibility, ContentRating, VideoOrientation } from '../enums/video-enums';

/**
 * Video Filter
 * For filtering and searching videos
 */
export interface VideoFilter extends BaseFilter {
  channelId?: string;
  type?: VideoType;
  status?: VideoStatus;
  visibility?: VideoVisibility;
  contentRating?: ContentRating;
  orientation?: VideoOrientation;
  categoryId?: string;
  tags?: string[];
  hashtags?: string[];
  minDuration?: number; // seconds
  maxDuration?: number; // seconds
  minViews?: number;
  maxViews?: number;
  hasSound?: boolean;
  isMonetized?: boolean;
  isSponsoredContent?: boolean;
  publishedAfter?: string;
  publishedBefore?: string;
  locationName?: string;
}
