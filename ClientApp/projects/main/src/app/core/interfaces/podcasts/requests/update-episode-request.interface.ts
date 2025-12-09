import { EpisodeType, ExplicitContent } from '../enums/podcast-enums';
import { EpisodeGuest } from '../podcast-episode.interface';

/**
 * Update Episode Request
 */
export interface UpdateEpisodeRequest {
  title: string | null;
  description: string | null;
  summary: string | null;
  showNotes: string | null;
  seasonNumber: number | null;
  episodeNumber: number | null;
  thumbnailUrl: string | null;
  type: EpisodeType | null;
  explicitContent: ExplicitContent | null;
  allowComments: boolean | null;
  allowDownloads: boolean | null;
  guests: EpisodeGuest[] | null;
}

/**
 * Update Chapter Request
 */
export interface UpdateChapterRequest {
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  url: string | null;
  startTime: string | null; // TimeSpan
  endTime: string | null; // TimeSpan
}
