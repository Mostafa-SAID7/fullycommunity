import { EpisodeType, ExplicitContent } from '../enums/podcast-enums';
import { EpisodeGuest } from '../podcast-episode.interface';

/**
 * Create Episode Request
 */
export interface CreateEpisodeRequest {
  title: string;
  description: string | null;
  summary: string | null;
  showNotes: string | null;
  seasonNumber: number | null;
  episodeNumber: number;
  type: EpisodeType;
  explicitContent: ExplicitContent;
  allowComments: boolean;
  allowDownloads: boolean;
  scheduledPublishAt: string | null;
  chapters: CreateChapterRequest[] | null;
  guests: EpisodeGuest[] | null;
}

/**
 * Create Chapter Request
 */
export interface CreateChapterRequest {
  title: string;
  description: string | null;
  imageUrl: string | null;
  url: string | null;
  startTime: string; // TimeSpan
  endTime: string | null; // TimeSpan
}
