import { PodcastType, PodcastCategory, ExplicitContent } from '../enums/podcast-enums';

/**
 * Create Podcast Show Request
 */
export interface CreatePodcastShowRequest {
  title: string;
  description: string | null;
  summary: string | null;
  coverImageUrl: string | null;
  type: PodcastType;
  category: PodcastCategory;
  tags: string[] | null;
  language: string | null;
  explicitContent: ExplicitContent;
  allowComments: boolean;
  allowDownloads: boolean;
}
