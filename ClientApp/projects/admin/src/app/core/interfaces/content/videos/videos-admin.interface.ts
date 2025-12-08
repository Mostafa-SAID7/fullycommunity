export type VideoStatus = 'published' | 'unlisted' | 'private' | 'pending';

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  status: VideoStatus;
  uploaderName: string;
  uploadedAt: string;
}

export interface VideosListResponse {
  items: Video[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface PendingVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  uploaderName: string;
  uploadedAt: string;
}

export interface VideoStats {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  averageViewDuration: number;
  topVideos: TopVideo[];
}

export interface TopVideo {
  id: string;
  title: string;
  viewCount: number;
  likeCount: number;
}

export interface VideoActionRequest {
  reason?: string;
}
