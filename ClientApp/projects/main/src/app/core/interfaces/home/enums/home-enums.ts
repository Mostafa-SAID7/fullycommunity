/**
 * Feed Item Type
 */
export enum FeedItemType {
  Post = 0,
  Video = 1,
  Podcast = 2,
  Product = 3,
  Auction = 4,
  Service = 5,
  NewsArticle = 6,
  Event = 7,
  Question = 8,
  Review = 9,
  Guide = 10,
  Page = 11,
  Group = 12,
  LiveStream = 13,
  Story = 14
}

/**
 * Feed Content Source
 */
export enum FeedContentSource {
  Community = 0,
  Videos = 1,
  Podcasts = 2,
  Marketplace = 3,
  Services = 4,
  News = 5,
  Events = 6,
  QA = 7,
  Reviews = 8,
  Guides = 9,
  Pages = 10,
  Groups = 11,
  Maps = 12
}

/**
 * Feed Filter Type
 */
export enum FeedFilterType {
  All = 0,
  Following = 1,
  Trending = 2,
  Recommended = 3,
  Recent = 4,
  Popular = 5,
  Nearby = 6,
  Saved = 7
}

/**
 * Content Preference
 */
export enum ContentPreference {
  Posts = 0,
  Videos = 1,
  Podcasts = 2,
  Marketplace = 3,
  Services = 4,
  News = 5,
  Events = 6,
  QA = 7,
  Reviews = 8
}

/**
 * Time Range
 */
export enum TimeRange {
  Today = 0,
  ThisWeek = 1,
  ThisMonth = 2,
  AllTime = 3
}

/**
 * Sort By
 */
export enum FeedSortBy {
  Relevance = 0,
  Recent = 1,
  Popular = 2,
  Trending = 3
}
