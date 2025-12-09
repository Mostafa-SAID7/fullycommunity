/**
 * Podcast Analytics Summary
 */
export interface PodcastAnalyticsSummary {
  totalSubscribers: number;
  subscribersGained: number;
  subscribersLost: number;
  totalPlays: number;
  uniqueListeners: number;
  totalListenTime: string; // TimeSpan
  averageCompletionRate: number;
  totalDownloads: number;
  totalComments: number;
  totalShares: number;
  estimatedRevenue: number;
  changeFromPreviousPeriod: number;
}

/**
 * Podcast Daily Analytics
 */
export interface PodcastDailyAnalytics {
  date: string;
  subscribersGained: number;
  subscribersLost: number;
  totalSubscribers: number;
  totalPlays: number;
  uniqueListeners: number;
  totalListenTime: string; // TimeSpan
  totalDownloads: number;
  totalLikes: number;
  totalComments: number;
  estimatedRevenue: number;
}

/**
 * Podcast Demographics
 */
export interface PodcastDemographics {
  ageGroups: DemographicItem[];
  genders: DemographicItem[];
  countries: DemographicItem[];
  devices: DemographicItem[];
}

/**
 * Demographic Item
 */
export interface DemographicItem {
  name: string;
  count: number;
  percentage: number;
}

/**
 * Top Episode
 */
export interface TopEpisode {
  episodeId: string;
  title: string;
  episodeNumber: number;
  playCount: number;
  uniqueListeners: number;
  completionRate: number;
  revenue: number;
}

/**
 * Traffic Sources
 */
export interface TrafficSources {
  fromSearch: number;
  fromBrowse: number;
  fromExternal: number;
  fromSuggested: number;
  fromNotification: number;
  fromPlaylist: number;
  platforms: PlatformSource[];
}

/**
 * Platform Source
 */
export interface PlatformSource {
  platform: string;
  count: number;
  percentage: number;
}

/**
 * Episode Analytics Summary
 */
export interface EpisodeAnalyticsSummary {
  totalPlays: number;
  uniqueListeners: number;
  totalListenTime: string; // TimeSpan
  averageListenPercent: number;
  completionRate: number;
  totalDownloads: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  estimatedRevenue: number;
  changeFromPreviousPeriod: number;
}

/**
 * Episode Daily Analytics
 */
export interface EpisodeDailyAnalytics {
  date: string;
  plays: number;
  uniqueListeners: number;
  totalListenTime: string; // TimeSpan
  averageListenPercent: number;
  downloads: number;
  likes: number;
  comments: number;
  shares: number;
  estimatedRevenue: number;
}

/**
 * Episode Demographics
 */
export interface EpisodeDemographics {
  ageGroups: DemographicItem[];
  genders: DemographicItem[];
  countries: DemographicItem[];
  devices: DemographicItem[];
}

/**
 * Retention Data
 */
export interface RetentionData {
  retentionCurve: RetentionPoint[];
  dropOffPoints: DropOffPoint[];
  averageRetention: number;
}

/**
 * Retention Point
 */
export interface RetentionPoint {
  percentThrough: number;
  retainedPercent: number;
}

/**
 * Drop Off Point
 */
export interface DropOffPoint {
  timestamp: string; // TimeSpan
  dropOffPercent: number;
  chapterTitle: string | null;
}

/**
 * Revenue Analytics
 */
export interface RevenueAnalytics {
  totalRevenue: number;
  adRevenue: number;
  sponsorRevenue: number;
  tipRevenue: number;
  dailyRevenue: DailyRevenue[];
  topEpisodes: EpisodeRevenue[];
}

/**
 * Daily Revenue
 */
export interface DailyRevenue {
  date: string;
  adRevenue: number;
  sponsorRevenue: number;
  tipRevenue: number;
  total: number;
}

/**
 * Episode Revenue
 */
export interface EpisodeRevenue {
  episodeId: string;
  title: string;
  revenue: number;
}
