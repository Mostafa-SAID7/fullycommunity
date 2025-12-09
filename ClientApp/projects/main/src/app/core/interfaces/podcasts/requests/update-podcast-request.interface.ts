import { PodcastCategory, ExplicitContent } from '../enums/podcast-enums';

/**
 * Update Podcast Show Request
 */
export interface UpdatePodcastShowRequest {
  title: string | null;
  description: string | null;
  summary: string | null;
  coverImageUrl: string | null;
  bannerImageUrl: string | null;
  category: PodcastCategory | null;
  tags: string[] | null;
  language: string | null;
  explicitContent: ExplicitContent | null;
  allowComments: boolean | null;
  allowDownloads: boolean | null;
  applePodcastsUrl: string | null;
  spotifyUrl: string | null;
  websiteUrl: string | null;
  copyright: string | null;
  author: string | null;
}
