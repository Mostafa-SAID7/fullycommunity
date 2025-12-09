/**
 * Video Analytics
 */
export interface VideoAnalytics {
  videoId: string;
  totalViews: number;
  uniqueViewers: number;
  averageWatchTime: string; // TimeSpan
  averageWatchPercent: number;
  completionRate: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;
  downloadCount: number;
  engagementRate: number;
  viewsByDate: ViewsByDate[];
  viewsByCountry: ViewsByCountry[];
  viewsByDevice: ViewsByDevice[];
  trafficSources: TrafficSource[];
}

/**
 * Views By Date
 */
export interface ViewsByDate {
  date: string;
  views: number;
  uniqueViewers: number;
  watchTime: string; // TimeSpan
}

/**
 * Views By Country
 */
export interface ViewsByCountry {
  country: string;
  countryCode: string;
  views: number;
  percentage: number;
}

/**
 * Views By Device
 */
export interface ViewsByDevice {
  deviceType: string; // Mobile, Desktop, Tablet, TV
  views: number;
  percentage: number;
}

/**
 * Traffic Source
 */
export interface TrafficSource {
  source: string; // Direct, Search, Social, External, Suggested
  views: number;
  percentage: number;
}
