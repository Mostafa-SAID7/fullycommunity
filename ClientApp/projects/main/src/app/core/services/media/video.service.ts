import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedResult } from '../../types/common.types';

// Video Models
export interface Video {
  id: string;
  channelId: string;
  channel: ChannelSummary;
  title: string;
  description?: string;
  slug?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  previewGifUrl?: string;
  duration: string;
  width: number;
  height: number;
  orientation: VideoOrientation;
  aspectRatio: number;
  type: VideoType;
  status: VideoStatus;
  visibility: VideoVisibility;
  contentRating: ContentRating;
  publishedAt?: string;
  categoryId?: string;
  category?: VideoCategory;
  tags: string[];
  hashtags: string[];
  locationName?: string;
  viewCount: number;
  uniqueViewers: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;
  averageWatchPercent: number;
  allowComments: boolean;
  allowDuets: boolean;
  allowStitches: boolean;
  allowDownloads: boolean;
  showLikeCount: boolean;
  isPinned: boolean;
  isMonetized: boolean;
  soundId?: string;
  sound?: Sound;
  duetOfVideoId?: string;
  stitchOfVideoId?: string;
  replyToVideoId?: string;
  userReaction?: ReactionType;
  isSaved: boolean;
  createdAt: string;
}

export interface ChannelSummary {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl?: string;
  isVerified: boolean;
  subscriberCount: number;
}

export interface Channel {
  id: string;
  userId: string;
  handle: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  websiteUrl?: string;
  status: ChannelStatus;
  tier: ChannelTier;
  isVerified: boolean;
  verifiedAt?: string;
  subscriberCount: number;
  videoCount: number;
  totalViews: number;
  totalLikes: number;
  allowComments: boolean;
  showSubscriberCount: boolean;
  monetizationStatus: MonetizationStatus;
  instagramUrl?: string;
  twitterUrl?: string;
  tikTokUrl?: string;
  youTubeUrl?: string;
  country?: string;
  city?: string;
  contentCategories: string[];
  isSubscribed?: boolean;
  createdAt: string;
}

export interface ChannelStats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  subscriberGrowth: number;
  viewsGrowth: number;
  topVideos: Video[];
  recentActivity: ChannelActivity[];
}

export interface ChannelActivity {
  type: string;
  description: string;
  timestamp: string;
}

export interface VideoComment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  parentId?: string;
  likeCount: number;
  replyCount: number;
  isPinned: boolean;
  isLiked: boolean;
  isCreatorReply: boolean;
  replies?: VideoComment[];
  createdAt: string;
}

export interface VideoCategory {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  videoCount: number;
}

export interface Sound {
  id: string;
  title: string;
  artistName: string;
  coverUrl?: string;
  duration: string;
  usageCount: number;
  isOriginal: boolean;
}

export interface SavedVideo {
  id: string;
  videoId: string;
  video: Video;
  collectionId?: string;
  savedAt: string;
}

export interface VideoCollection {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  videoCount: number;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface LiveStream {
  id: string;
  channelId: string;
  channel: ChannelSummary;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  status: LiveStreamStatus;
  scheduledStartAt?: string;
  startedAt?: string;
  endedAt?: string;
  viewerCount: number;
  peakViewerCount: number;
  likeCount: number;
  giftCount: number;
  totalGiftValue: number;
  chatEnabled: boolean;
  giftsEnabled: boolean;
  streamKey?: string;
  streamUrl?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  liveStreamId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  type: ChatMessageType;
  giftType?: string;
  giftValue?: number;
  isPinned: boolean;
  createdAt: string;
}

export interface GiftType {
  id: string;
  name: string;
  iconUrl: string;
  coinCost: number;
  animationUrl?: string;
}

// Enums
export type VideoOrientation = 'Landscape' | 'Portrait' | 'Square';
export type VideoType = 'Standard' | 'Short' | 'Live' | 'Story' | 'Reel';
export type VideoStatus = 'Draft' | 'Processing' | 'Published' | 'Scheduled' | 'Unlisted' | 'Private' | 'Deleted';
export type VideoVisibility = 'Public' | 'Unlisted' | 'Private' | 'FollowersOnly';
export type ContentRating = 'General' | 'Teen' | 'Mature' | 'Restricted';
export type ReactionType = 'Like' | 'Love' | 'Haha' | 'Wow' | 'Sad' | 'Angry';
export type ChannelStatus = 'Active' | 'Suspended' | 'Banned' | 'Inactive';
export type ChannelTier = 'Basic' | 'Creator' | 'Partner' | 'Verified';
export type MonetizationStatus = 'NotEligible' | 'Pending' | 'Approved' | 'Suspended';
export type LiveStreamStatus = 'Scheduled' | 'Live' | 'Paused' | 'Ended' | 'Cancelled';
export type ChatMessageType = 'Text' | 'Gift' | 'System' | 'Pinned';

// Request/Response Types
export interface VideoSearchRequest {
  query?: string;
  categoryId?: string;
  channelId?: string;
  hashtag?: string;
  type?: VideoType;
  sortBy?: 'Recent' | 'Popular' | 'Trending' | 'MostViewed';
  page?: number;
  pageSize?: number;
}

export interface VideoFeedRequest {
  feedType?: 'ForYou' | 'Following' | 'Trending' | 'New';
  page?: number;
  pageSize?: number;
}

export interface ChannelSearchRequest {
  query?: string;
  category?: string;
  sortBy?: 'Subscribers' | 'Recent' | 'Popular';
  page?: number;
  pageSize?: number;
}

export interface CreateVideoRequest {
  title: string;
  description?: string;
  categoryId?: string;
  tags?: string[];
  hashtags?: string[];
  visibility?: VideoVisibility;
  allowComments?: boolean;
  allowDuets?: boolean;
  allowDownloads?: boolean;
  scheduledPublishAt?: string;
}

export interface UpdateVideoRequest {
  title?: string;
  description?: string;
  categoryId?: string;
  tags?: string[];
  hashtags?: string[];
  visibility?: VideoVisibility;
  allowComments?: boolean;
  allowDuets?: boolean;
  allowDownloads?: boolean;
}

export interface CreateChannelRequest {
  handle: string;
  displayName: string;
  bio?: string;
  websiteUrl?: string;
  contentCategories?: string[];
}

export interface UpdateChannelRequest {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  tikTokUrl?: string;
  youTubeUrl?: string;
  allowComments?: boolean;
  showSubscriberCount?: boolean;
  contentCategories?: string[];
}

export interface CreateCommentRequest {
  videoId: string;
  content: string;
  parentId?: string;
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface CreateLiveStreamRequest {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  scheduledStartAt?: string;
  chatEnabled?: boolean;
  giftsEnabled?: boolean;
}

export interface SendChatMessageRequest {
  content: string;
}

export interface SendGiftRequest {
  giftTypeId: string;
  message?: string;
}



@Injectable({ providedIn: 'root' })
export class VideoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/videos`;

  // Video Content
  getVideo(id: string): Observable<Video> {
    return this.http.get<Video>(`${this.baseUrl}/${id}`);
  }

  getVideoBySlug(slug: string): Observable<Video> {
    return this.http.get<Video>(`${this.baseUrl}/slug/${slug}`);
  }

  searchVideos(request: VideoSearchRequest): Observable<PagedResult<Video>> {
    const params = this.buildParams(request);
    return this.http.get<PagedResult<Video>>(this.baseUrl, { params });
  }

  getFeed(request: VideoFeedRequest): Observable<PagedResult<Video>> {
    const params = this.buildParams(request);
    return this.http.get<PagedResult<Video>>(`${this.baseUrl}/feed`, { params });
  }

  getTrendingVideos(count = 20): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.baseUrl}/trending`, { params: { count } });
  }

  getRelatedVideos(videoId: string, count = 10): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.baseUrl}/${videoId}/related`, { params: { count } });
  }

  getTrendingHashtags(count = 20): Observable<{ hashtag: string; count: number }[]> {
    return this.http.get<{ hashtag: string; count: number }[]>(`${this.baseUrl}/hashtags/trending`, { params: { count } });
  }

  getCategories(): Observable<VideoCategory[]> {
    return this.http.get<VideoCategory[]>(`${this.baseUrl}/categories`);
  }

  // Video Upload & Management
  initiateUpload(request: CreateVideoRequest): Observable<{ videoId: string; uploadUrl: string }> {
    return this.http.post<{ videoId: string; uploadUrl: string }>(`${this.baseUrl}/upload`, request);
  }

  completeUpload(videoId: string, videoUrl: string, thumbnailUrl?: string): Observable<Video> {
    return this.http.post<Video>(`${this.baseUrl}/${videoId}/complete-upload`, { videoUrl, thumbnailUrl });
  }

  updateVideo(id: string, request: UpdateVideoRequest): Observable<Video> {
    return this.http.put<Video>(`${this.baseUrl}/${id}`, request);
  }

  publishVideo(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/publish`, {});
  }

  unpublishVideo(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/unpublish`, {});
  }

  deleteVideo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  recordView(videoId: string, sessionId?: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${videoId}/view`, { sessionId });
  }

  updateWatchProgress(videoId: string, watchDuration: number, watchPercent: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${videoId}/watch-progress`, { watchDuration, watchPercent });
  }

  // Engagement
  react(videoId: string, type: ReactionType): Observable<{ id: string; type: ReactionType }> {
    return this.http.post<{ id: string; type: ReactionType }>(`${this.baseUrl}/${videoId}/react`, { type });
  }

  removeReaction(videoId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${videoId}/react`);
  }

  getComments(videoId: string, page = 1, pageSize = 20, sortBy = 'Top'): Observable<PagedResult<VideoComment>> {
    return this.http.get<PagedResult<VideoComment>>(`${this.baseUrl}/${videoId}/comments`, {
      params: { page, pageSize, sortBy }
    });
  }

  createComment(request: CreateCommentRequest): Observable<VideoComment> {
    return this.http.post<VideoComment>(`${this.baseUrl}/comments`, request);
  }

  updateComment(id: string, content: string): Observable<VideoComment> {
    return this.http.put<VideoComment>(`${this.baseUrl}/comments/${id}`, { content });
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comments/${id}`);
  }

  likeComment(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/comments/${id}/like`, {});
  }

  unlikeComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comments/${id}/like`);
  }

  pinComment(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/comments/${id}/pin`, {});
  }

  // Save & Collections
  saveVideo(videoId: string, collectionId?: string): Observable<SavedVideo> {
    return this.http.post<SavedVideo>(`${this.baseUrl}/${videoId}/save`, { videoId, collectionId });
  }

  unsaveVideo(videoId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${videoId}/save`);
  }

  getSavedVideos(collectionId?: string, page = 1, pageSize = 20): Observable<PagedResult<SavedVideo>> {
    const params: any = { page, pageSize };
    if (collectionId) params.collectionId = collectionId;
    return this.http.get<PagedResult<SavedVideo>>(`${this.baseUrl}/saved`, { params });
  }

  getCollections(): Observable<VideoCollection[]> {
    return this.http.get<VideoCollection[]>(`${this.baseUrl}/collections`);
  }

  createCollection(request: CreateCollectionRequest): Observable<VideoCollection> {
    return this.http.post<VideoCollection>(`${this.baseUrl}/collections`, request);
  }

  updateCollection(id: string, request: CreateCollectionRequest): Observable<VideoCollection> {
    return this.http.put<VideoCollection>(`${this.baseUrl}/collections/${id}`, request);
  }

  deleteCollection(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/collections/${id}`);
  }

  // Share
  recordShare(videoId: string, platform: string): Observable<{ shareUrl: string }> {
    return this.http.post<{ shareUrl: string }>(`${this.baseUrl}/${videoId}/share`, { platform });
  }

  private buildParams(obj: any): HttpParams {
    let params = new HttpParams();
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined && obj[key] !== null) {
        params = params.set(key, obj[key].toString());
      }
    });
    return params;
  }
}
