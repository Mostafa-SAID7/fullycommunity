/**
 * Create Channel Request
 */
export interface CreateChannelRequest {
  handle: string;
  displayName: string;
  bio?: string;
  avatarFile?: File;
  bannerFile?: File;
  websiteUrl?: string;
  contentCategories?: string[];
  country?: string;
  city?: string;
}

/**
 * Update Channel Request
 */
export interface UpdateChannelRequest {
  displayName?: string;
  bio?: string;
  avatarFile?: File;
  bannerFile?: File;
  websiteUrl?: string;
  allowComments?: boolean;
  showSubscriberCount?: boolean;
  allowDuets?: boolean;
  allowStitches?: boolean;
  allowDownloads?: boolean;
  instagramUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  contentCategories?: string[];
  country?: string;
  city?: string;
}
