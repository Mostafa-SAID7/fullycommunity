/**
 * Video List Response Interfaces
 * List and search related response interfaces
 */

import { PaginatedResponse } from '../../../common/base.interface';
import { VideoAdmin, VideoStats, VideoCategory } from '../components/video-components';
import { VideoStatus, VideoQuality, VideoDuration, AgeRating } from '../enums/video-enums';

export interface VideoListResponse extends PaginatedResponse<VideoAdmin> {
  stats: VideoStats;
  categories: VideoCategory[];
  filters: {
    statuses: { value: VideoStatus; label: string; count: number }[];
    qualities: { value: VideoQuality; label: string; count: number }[];
    durations: { value: VideoDuration; label: string; count: number }[];
    ageRatings: { value: AgeRating; label: string; count: number }[];
  };
}

export interface VideoSearchResponse {
  videos: VideoAdmin[];
  total: number;
  searchTime: number;
  suggestions: string[];
  filters: {
    categories: { id: string; name: string; count: number }[];
    creators: { id: string; name: string; count: number }[];
    durations: { value: VideoDuration; label: string; count: number }[];
    qualities: { value: VideoQuality; label: string; count: number }[];
  };
  facets?: {
    [key: string]: { value: string; count: number }[];
  };
}

export interface VideoExportResponse {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  progress: number;
  totalRecords: number;
  processedRecords: number;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
  error?: string;
}